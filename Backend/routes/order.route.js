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

async function attachSupplierNames(orders) {
  const supplierIds = Array.from(new Set((orders || []).map(o => String(o.supplierId || '')).filter(Boolean)));
  if (supplierIds.length === 0) return orders;
  const suppliers = await User.find({ _id: { $in: supplierIds } }).select('company_name username').lean();
  const supplierMap = new Map(suppliers.map(s => [String(s._id), s.company_name || s.username || '']));
  return orders.map(o => ({
    ...o,
    supplierName: supplierMap.get(String(o.supplierId)) || '',
  }));
}

// Admin: fetch all orders
router.get('/all', verifyToken, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Access denied' });
    }
    const raw = await Order.find({}).sort({ createdAt: -1 }).lean();
    const orders = await attachSupplierNames(raw);
    res.json({ orders });
  } catch (err) {
    console.error('Error fetching all orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Admin: delete an order by id
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Access denied' });
    }
    const { id } = req.params;
    const existing = await Order.findById(id);
    if (!existing) return res.status(404).json({ error: 'Order not found' });

    await Order.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting order:', err);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

// Public: fetch all orders (dev convenience)
router.get('/all-public', async (req, res) => {
  try {
    const raw = await Order.find({}).sort({ createdAt: -1 }).lean();
    const orders = await attachSupplierNames(raw);
    res.json({ orders });
  } catch (err) {
    console.error('Error fetching all orders (public):', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

export default router;