import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
  name: { type: String, required: true },
  unitAmount: { type: Number, required: true }, // in the smallest currency unit (paisa)
  quantity: { type: Number, required: true },
  subtotal: { type: Number, required: true }, // unitAmount * quantity
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
  stripeSessionId: { type: String, required: true, index: true },
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