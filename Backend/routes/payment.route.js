import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import fetch from 'node-fetch';

dotenv.config(); // ✅ Make sure environment variables are loaded first

const router = express.Router();

// ✅ Check if key exists
if (!process.env.STRIPE_SECRET_KEY) {
  console.error("❌ STRIPE_SECRET_KEY is missing in .env");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Utility: create grouped orders by supplier
async function createOrdersFromLineItems({
  lineItems, // array of { productId, name, unitAmount, quantity, image? }
  sessionLike, // object containing customer/shipping/userId
  paymentMeta, // { method, provider, ref, esewaPid }
  statusOverride, // 'pending' | 'paid'
}) {
  // Group items by supplier using product.userRef
  const itemsBySupplier = new Map();

  for (const item of lineItems) {
    const qty = Number(item.quantity || 0);
    const productId = item.productId;
    const name = item.name;
    const unitAmount = Number(item.unitAmount || 0);
    if (!productId || !Number.isInteger(qty) || qty <= 0 || !Number.isFinite(unitAmount) || unitAmount <= 0) continue;

    const productDoc = await Product.findById(productId).lean();
    if (!productDoc) continue;
    const supplierId = productDoc.userRef;

    // Decrement stock
    await Product.findByIdAndUpdate(productId, { $inc: { stock: -qty } });

    const orderItem = {
      productId,
      name: name || productDoc.productName,
      unitAmount,
      quantity: qty,
      subtotal: unitAmount * qty,
      image: Array.isArray(productDoc.images) && productDoc.images.length > 0 ? productDoc.images[0] : undefined,
    };

    if (!itemsBySupplier.has(supplierId)) itemsBySupplier.set(supplierId, []);
    itemsBySupplier.get(supplierId).push(orderItem);
  }

  // Create an Order per supplier
  for (const [supplierId, items] of itemsBySupplier.entries()) {
    const totalAmount = items.reduce((sum, it) => sum + it.subtotal, 0);
    await Order.create({
      supplierId,
      items,
      currency: 'npr',
      totalAmount,
      status: statusOverride || 'pending',
      stripeSessionId: paymentMeta?.provider === 'stripe' ? paymentMeta?.ref : undefined,
      paymentMethod: paymentMeta?.method,
      paymentProvider: paymentMeta?.provider,
      paymentRef: paymentMeta?.ref,
      esewaPid: paymentMeta?.esewaPid, // stores transaction_uuid for RC
      userId: sessionLike?.client_reference_id || sessionLike?.userId || undefined,
      customer: {
        name: sessionLike?.customer_details?.name || sessionLike?.name,
        email: sessionLike?.customer_details?.email?.toLowerCase?.() || sessionLike?.email?.toLowerCase?.(),
        phone: sessionLike?.customer_details?.phone || sessionLike?.phone,
      },
      shippingAddress: sessionLike?.shipping_details?.address ? {
        line1: sessionLike.shipping_details.address.line1,
        line2: sessionLike.shipping_details.address.line2,
        city: sessionLike.shipping_details.address.city,
        state: sessionLike.shipping_details.address.state,
        postal_code: sessionLike.shipping_details.address.postal_code,
        country: sessionLike.shipping_details.address.country,
      } : sessionLike?.shippingAddress,
    });
  }

  const productIds = Array.from(new Set((lineItems || []).map(li => li.productId).filter(Boolean)));
  return { created: true, productIds };
}

router.post("/create-checkout-session", async (req, res) => {
  try {
    const { products, userId, email } = req.body || {};

    // Basic validation
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Products array is required" });
    }

    // Validate each product and sanitize
    const line_items = products.map((p, index) => {
      const name = typeof p?.name === 'string' && p.name.trim().length > 0 ? p.name.trim() : null;
      const price = Number(p?.price);
      const qty = Number(p?.qty);
      const productId = typeof p?.productId === 'string' ? p.productId : null;

      if (!name) {
        throw new Error(`Product at index ${index} is missing a valid name`);
      }
      if (!Number.isFinite(price) || price <= 0) {
        throw new Error(`Product '${name}' has invalid price`);
      }
      if (!Number.isInteger(qty) || qty <= 0) {
        throw new Error(`Product '${name}' has invalid quantity`);
      }

      return {
        price_data: {
          currency: "npr",
          product_data: { name, metadata: productId ? { productId } : {} },
          unit_amount: Math.round(price * 100), // in paisa
        },
        quantity: qty,
      };
    });

    const frontendBase = process.env.FRONTEND_BASE_URL || "http://localhost:5173";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${frontendBase}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendBase}/cancel`,
      customer_creation: 'if_required',
      billing_address_collection: 'auto',
      shipping_address_collection: { allowed_countries: ['NP', 'IN'] },
      client_reference_id: userId || undefined,
      customer_email: email || undefined,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || 'Unable to create checkout session' });
  }
});

async function createOrdersFromSession(session) {
  // Idempotency: do nothing if we already created orders for this session
  const exists = await Order.exists({ stripeSessionId: session.id });
  if (exists) {
    // If exists, attempt to fetch item productIds from existing orders for completeness
    const existingOrders = await Order.find({ stripeSessionId: session.id }).lean();
    const productIds = Array.from(new Set(existingOrders.flatMap(o => (o.items || []).map(i => i.productId)).filter(Boolean)));
    return { created: false, reason: 'already_exists', productIds };
  }

  // Retrieve line items to know what was purchased
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100, expand: ['data.price.product'] });

  // Map to common structure
  const normalized = [];
  for (const item of lineItems.data) {
    const qty = item.quantity || 0;
    const productId = item.price?.product?.metadata?.productId;
    const name = item.description;
    const unitAmount = item.amount_total && qty > 0 ? Math.round(item.amount_total / qty) : item.price?.unit_amount || 0;
    if (!productId || !Number.isInteger(qty) || qty <= 0) continue;
    normalized.push({ productId, name, unitAmount, quantity: qty });
  }

  return await createOrdersFromLineItems({
    lineItems: normalized,
    sessionLike: session,
    paymentMeta: {
      method: 'card',
      provider: 'stripe',
      ref: session.id,
    },
    statusOverride: 'paid',
  });
}

// Stripe Webhook to handle post-payment fulfillment
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      event = req.body; // Not recommended in production
    }
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      await createOrdersFromSession(session);
    }
  } catch (err) {
    console.error('Webhook handling error:', err);
  }

  res.json({ received: true });
});

// Fallback endpoint to confirm and create orders if webhook is not configured in local/dev
router.post('/confirm', async (req, res) => {
  try {
    const { session_id } = req.body || {};
    if (!session_id) return res.status(400).json({ error: 'session_id is required' });

    const session = await stripe.checkout.sessions.retrieve(session_id);
    const result = await createOrdersFromSession(session);
    res.json({ ok: true, ...result });
  } catch (err) {
    console.error('Confirm handling error:', err);
    res.status(500).json({ error: 'Failed to confirm session' });
  }
});

// ===================== eSewa RC Integration =====================
// RC docs typically use endpoints under rc.esewa.com.np
// - Main:        https://rc.esewa.com.np/api/epay/main
// - Status API:  https://rc.esewa.com.np/api/epay/transaction/status/

const ESEWA_MAIN_URL = 'https://epay.esewa.com.np/api/epay/main/v2/form '; // for redirect
const ESEWA_STATUS_URL = 'https://rc.esewa.com.np/api/epay/transaction/status/'; // server-to-server
const ESEWA_PRODUCT_CODE = process.env.ESEWA_PRODUCT_CODE || 'EPAYTEST';

function formatRupeesFromPaisa(paisa) {
  return (Number(paisa || 0) / 100).toFixed(2);
}

// Initiate eSewa payment
router.post('/esewa/initiate', async (req, res) => {
  try {
    const { products, userId, email, phone } = req.body || {};
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'Products array is required' });
    }

    let totalPaisa = 0;
    const items = [];

    for (const p of products) {
      const name = p?.name?.trim();
      const price = Number(p?.price);
      const qty = Number(p?.qty);
      const productId = p?.productId;

      if (!name || !Number.isFinite(price) || price <= 0 || !Number.isInteger(qty) || qty <= 0) {
        throw new Error(`Invalid product data`);
      }

      const unitAmount = Math.round(price * 100);
      totalPaisa += unitAmount * qty;
      items.push({ productId, name, unitAmount, quantity: qty });
    }

    const amount = formatRupeesFromPaisa(totalPaisa); // in rupees
    const transaction_uuid = `TXN-${Date.now()}-${Math.floor(Math.random()*100000)}`;

    // Persist pending orders
    await createOrdersFromLineItems({
      lineItems: items,
      sessionLike: { name: undefined, email, phone, userId },
      paymentMeta: { method: 'wallet_esewa', provider: 'esewa', ref: undefined, esewaPid: transaction_uuid },
      statusOverride: 'pending',
    });

    const frontendBase = process.env.FRONTEND_BASE_URL || 'http://localhost:5173';
    const success_url = `${frontendBase}/esewa-success?transaction_uuid=${transaction_uuid}`;
    const failure_url = `${frontendBase}/esewa-failure?transaction_uuid=${transaction_uuid}`;

    res.json({
      esewa: {
        endpoint: ESEWA_MAIN_URL,
        params: {
          amount,
          total_amount: amount,
          tax_amount: '0',
          product_code: ESEWA_PRODUCT_CODE,
          product_service_charge: '0',
          product_delivery_charge: '0',
          transaction_uuid,
          success_url,
          failure_url,
        },
      },
    });
  } catch (err) {
    console.error('Esewa initiate error:', err);
    res.status(400).json({ error: err.message || 'Unable to initiate eSewa payment' });
  }
});

// Verify eSewa payment (server-to-server)
router.post('/esewa/verify', async (req, res) => {
  try {
    const { transaction_uuid, pid } = req.body || {};
    const txn = transaction_uuid || pid;
    if (!txn) return res.status(400).json({ error: 'transaction_uuid is required' });

    // Get total_amount from pending orders
    const orders = await Order.find({ esewaPid: txn }).lean();
    if (!orders || orders.length === 0) return res.status(404).json({ error: 'No orders found for transaction' });

    const total_amount = formatRupeesFromPaisa(orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0));

    // Send POST request to RC status endpoint
    const params = new URLSearchParams();
    params.append('product_code', ESEWA_PRODUCT_CODE);
    params.append('total_amount', total_amount);
    params.append('transaction_uuid', txn);

    const verifyRes = await fetch(ESEWA_STATUS_URL, {
      method: 'POST',
      body: params,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const raw = await verifyRes.text();

    let ok = false;
    try {
      const json = JSON.parse(raw);
      const status = String(json?.status || '').toLowerCase();
      ok = status.includes('complete') || status.includes('success') || status === 'settled';
    } catch {
      ok = /success|complete|settled/i.test(raw);
    }

    if (!ok) return res.status(400).json({ error: 'Verification failed', raw });

    // Mark orders as paid
    await Order.updateMany({ esewaPid: txn }, { $set: { status: 'paid' } });

    const productIds = Array.from(new Set(orders.flatMap(o => (o.items || []).map(i => i.productId)).filter(Boolean)));
    res.json({ ok: true, productIds });
  } catch (err) {
    console.error('Esewa verify error:', err);
    res.status(400).json({ error: err.message || 'Unable to verify eSewa payment' });
  }
});

// ===================== COD Endpoint =====================
router.post('/cod', async (req, res) => {
  try {
    const { products, userId, email, phone, shippingAddress } = req.body || {};
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'Products array is required' });
    }

    const items = [];
    for (const [index, p] of products.entries()) {
      const name = typeof p?.name === 'string' && p.name.trim().length > 0 ? p.name.trim() : null;
      const price = Number(p?.price);
      const qty = Number(p?.qty);
      const productId = typeof p?.productId === 'string' ? p.productId : null;
      if (!name) throw new Error(`Product at index ${index} is missing a valid name`);
      if (!Number.isFinite(price) || price <= 0) throw new Error(`Product '${name}' has invalid price`);
      if (!Number.isInteger(qty) || qty <= 0) throw new Error(`Product '${name}' has invalid quantity`);
      const unitAmount = Math.round(price * 100);
      items.push({ productId, name, unitAmount, quantity: qty });
    }

    // Create orders
    const creation = await createOrdersFromLineItems({
      lineItems: items,
      sessionLike: { name: undefined, email, phone, userId, shippingAddress },
      paymentMeta: { method: 'cod', provider: 'cod', ref: undefined },
      statusOverride: 'pending',
    });

    // Generate and assign unique order numbers for the created COD orders (last few minutes window)
    const since = new Date(Date.now() - 5 * 60 * 1000);
    const createdCodOrders = await Order.find({
      paymentMethod: 'cod',
      createdAt: { $gte: since },
      userId: userId || undefined,
    }).sort({ createdAt: -1 });

    for (const ord of createdCodOrders) {
      if (ord.orderNumber) continue;
      // Generate a random but unique order number like COD-YYMMDD-XXXXXX
      const ymd = new Date().toISOString().slice(2, 10).replace(/-/g, '');
      let candidate;
      let attempts = 0;
      do {
        const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
        candidate = `COD-${ymd}-${rand}`;
        attempts += 1;
        if (attempts > 5) break;
      } while (await Order.exists({ orderNumber: candidate }));

      if (!ord.orderNumber) {
        ord.orderNumber = candidate;
        await ord.save();
      }
    }

    res.json({ ok: true, productIds: creation.productIds });
  } catch (err) {
    console.error('COD create error:', err);
    res.status(400).json({ error: err.message || 'Unable to place COD order' });
  }
});

export default router;