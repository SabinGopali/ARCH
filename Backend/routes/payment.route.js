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
    const { products } = req.body;

    const line_items = products.map((p) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: p.name,
        },
        unit_amount: Math.round(p.price * 100), // in paise
      },
      quantity: p.qty,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
