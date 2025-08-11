import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

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
          currency: "inr",
          product_data: { name },
          unit_amount: Math.round(price * 100), // in paise
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

export default router;
