import express from 'express';
import Order from '../models/order.model.js';
import { verifyToken } from '../utils/verifyuser.js';
import User from '../models/user.model.js';

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

// Fetch orders for the logged-in user by their email
router.get('/user/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });

    const orders = await Order.find({ 'customer.email': user.email }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    console.error('Error fetching user orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Admin: fetch all orders
router.get('/all', verifyToken, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Access denied' });
    }
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    console.error('Error fetching all orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

export default router;