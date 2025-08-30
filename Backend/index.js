import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();

const app = express();

// Middleware
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// Conditionally parse JSON (skip Stripe webhook raw body)
app.use((req, res, next) => {
  if (req.originalUrl === '/backend/payment/webhook') {
    return next();
  }
  return express.json()(req, res, next);
});

// ✅ Serve uploaded images statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || process.env.MONGO)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Test route
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running', status: 'OK' });
});

// Import and test routes ONE BY ONE with error handling
console.log('Loading routes one by one...');

const routes = [
  { path: '/backend/auth', module: './routes/auth.route.js', name: 'auth.route.js' },
  { path: '/backend/user', module: './routes/user.route.js', name: 'user.route.js' },
  { path: '/backend/Career', module: './routes/career.route.js', name: 'career.route.js' },
  { path: '/backend/Partners', module: './routes/partner.route.js', name: 'partner.route.js' },
  { path: '/backend/services', module: './routes/services.route.js', name: 'services.route.js' },
  { path: '/backend/client', module: './routes/client.route.js', name: 'client.route.js' },
  { path: '/backend/team', module: './routes/team.route.js', name: 'team.route.js' },
  { path: '/backend/form', module: './routes/form.route.js', name: 'form.route.js' },
  { path: '/backend/product', module: './routes/product.route.js', name: 'product.route.js' },
  { path: '/backend/subuser', module: './routes/subuser.route.js', name: 'subuser.route.js' },
  { path: '/backend/store', module: './routes/store.route.js', name: 'store.route.js' },
  { path: '/backend/payment', module: './routes/payment.route.js', name: 'payment.route.js' },
  { path: '/backend/order', module: './routes/order.route.js', name: 'order.route.js' },
  { path: '/backend/media', module: './routes/media.route.js', name: 'media.route.js' }
];

for (const route of routes) {
  try {
    const module = await import(route.module);
    app.use(route.path, module.default);
    console.log(`✅ ${route.name} loaded successfully`);
  } catch (error) {
    console.error(`❌ ERROR in ${route.name}:`, error.message);
    process.exit(1);
  }
}

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});