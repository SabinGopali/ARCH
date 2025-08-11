import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import Product from "../models/product.model.js";

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

      // Decrement stock for each item
      for (const item of lineItems.data) {
        const qty = item.quantity || 0;
        // We stored productId in price_data.product_data.metadata
        const productId = item.price?.product?.metadata?.productId;

        if (productId && Number.isInteger(qty) && qty > 0) {
          await Product.findByIdAndUpdate(
            productId,
            { $inc: { stock: -qty } },
            { new: true }
          );
        }
      }
    }
  } catch (err) {
    console.error('Webhook handling error:', err);
    // We still acknowledge receipt to avoid retries storm; log to fix
  }

  res.json({ received: true });
});

export default router;
