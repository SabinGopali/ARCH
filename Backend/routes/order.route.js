import express from 'express';
import Order from '../models/order.model.js';

const router = express.Router();

// TODO: add proper auth and supplier authorization
router.get('/supplier/:supplierId', async (req, res) => {
  try {
    const { supplierId } = req.params;
    const orders = await Order.find({ supplierId }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

export default router;