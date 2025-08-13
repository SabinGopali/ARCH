import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
  name: { type: String, required: true },
  unitAmount: { type: Number, required: true }, // in the smallest currency unit (paisa)
  quantity: { type: Number, required: true },
  subtotal: { type: Number, required: true }, // unitAmount * quantity
  image: { type: String },
}, { _id: false });

const addressSchema = new mongoose.Schema({
  line1: String,
  line2: String,
  city: String,
  state: String,
  postal_code: String,
  country: String,
}, { _id: false });

const orderSchema = new mongoose.Schema({
  supplierId: { type: String, required: true }, // maps to product.userRef
  items: { type: [orderItemSchema], required: true },
  currency: { type: String, default: 'npr' },
  totalAmount: { type: Number, required: true }, // in paisa
  status: { type: String, enum: ['pending', 'paid', 'fulfilled', 'canceled'], default: 'paid' },

  // Payment fields
  paymentMethod: { type: String, enum: ['card', 'wallet_esewa', 'cod'], default: 'card', index: true },
  paymentProvider: { type: String }, // e.g., 'stripe', 'esewa', 'cod'
  paymentRef: { type: String, index: true }, // generic payment reference like Stripe session id or eSewa refId

  // Optional human-friendly order number
  orderNumber: { type: String, index: true, unique: true, sparse: true },

  // Kept for backward compatibility with existing UI and queries
  stripeSessionId: { type: String, index: true },

  // eSewa specific helpful fields
  esewaPid: { type: String, index: true },

  userId: { type: String, index: true },
  customer: {
    name: String,
    email: String,
    phone: String,
  },
  shippingAddress: addressSchema,
}, { timestamps: true });

const Order = mongoose.model('order', orderSchema);
export default Order;