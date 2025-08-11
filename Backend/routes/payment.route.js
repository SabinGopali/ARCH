import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";

dotenv.config(); // ✅ Make sure environment variables are loaded first

const router = express.Router();

// ✅ Check if key exists
if (!process.env.STRIPE_SECRET_KEY) {
  console.error("❌ STRIPE_SECRET_KEY is missing in .env");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-checkout-session", async (req, res) => {
  try {
    const { products } = req.body || {};

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
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || 'Unable to create checkout session' });
  }
});

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

      // Retrieve line items to know what was purchased
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100, expand: ['data.price.product'] });

      // Group items by supplier using product.userRef
      const itemsBySupplier = new Map();

      for (const item of lineItems.data) {
        const qty = item.quantity || 0;
        const productId = item.price?.product?.metadata?.productId;
        const name = item.description;
        const unitAmount = item.amount_total && qty > 0 ? Math.round(item.amount_total / qty) : item.price?.unit_amount || 0;

        if (!productId || !Number.isInteger(qty) || qty <= 0) continue;

        const productDoc = await Product.findById(productId).lean();
        if (!productDoc) continue;
        const supplierId = productDoc.userRef;

        // Decrement stock
        await Product.findByIdAndUpdate(productId, { $inc: { stock: -qty } });

        const orderItem = {
          productId,
          name: name || productDoc.productName,
          unitAmount: unitAmount || Math.round((productDoc.specialPrice || productDoc.price) * 100),
          quantity: qty,
          subtotal: (unitAmount || Math.round((productDoc.specialPrice || productDoc.price) * 100)) * qty,
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
          status: 'paid',
          stripeSessionId: session.id,
          customer: {
            name: session.customer_details?.name,
            email: session.customer_details?.email,
            phone: session.customer_details?.phone,
          },
          shippingAddress: session.shipping_details?.address ? {
            line1: session.shipping_details.address.line1,
            line2: session.shipping_details.address.line2,
            city: session.shipping_details.address.city,
            state: session.shipping_details.address.state,
            postal_code: session.shipping_details.address.postal_code,
            country: session.shipping_details.address.country,
          } : undefined,
        });
      }
    }
  } catch (err) {
    console.error('Webhook handling error:', err);
  }

  res.json({ received: true });
});

export default router;