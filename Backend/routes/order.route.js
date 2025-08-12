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

// Fetch orders for the logged-in user by their email or userId
router.get('/user/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });

    const orders = await Order.find({
      $or: [
        { userId: req.user.id },
        { 'customer.email': user.email },
      ],
    }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    console.error('Error fetching user orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Delete an order belonging to the logged-in user
router.delete('/user/:orderId', verifyToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    // Load user to get email for comparison if needed
    let userEmail = undefined;
    try {
      const userDoc = await User.findById(req.user.id).select('email').lean();
      userEmail = userDoc?.email?.toLowerCase?.();
    } catch {}

    const isOwner = String(order.userId || '') === String(req.user.id) || String(order.customer?.email || '').toLowerCase() === String(userEmail || '');
    if (!isOwner) {
      return res.status(403).json({ error: 'Not authorized to delete this order' });
    }

    await Order.findByIdAndDelete(orderId);
    res.json({ ok: true });
  } catch (err) {
    console.error('Error deleting user order:', err);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

// Public: fetch orders by email (dev convenience)
router.get('/user/by-email', async (req, res) => {
  try {
    const email = String(req.query.email || '').trim().toLowerCase();
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const orders = await Order.find({ 'customer.email': email }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    console.error('Error fetching user orders by email:', err);
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

// Public: fetch all orders (dev convenience)
router.get('/all-public', async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    console.error('Error fetching all orders (public):', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

export default router;