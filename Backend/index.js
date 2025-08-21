import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import Stripe from "stripe";

// Routes
import userroute from './routes/user.route.js';
import authroute from './routes/auth.route.js';
import careerroute from './routes/career.route.js';
import partnerroute from './routes/partner.route.js';
import serviceroute from './routes/services.route.js';
import clientroute from './routes/client.route.js';
import teamroute from './routes/team.route.js';
import formroute from './routes/form.route.js';
import productroute from './routes/product.route.js';
import subuserroute from './routes/subuser.route.js';
import storeroute from './routes/store.route.js';
import paymentroute from './routes/payment.route.js';
import orderroute from './routes/order.route.js';
import mediaroute from './routes/media.route.js';

dotenv.config();

const app = express();

// ✅ Middleware
app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// ✅ MongoDB Connection
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/emailAuthSystem';
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Routes
app.use('/backend/user', userroute);
app.use('/backend/auth', authroute);
app.use('/backend/career', careerroute);
app.use('/backend/partners', partnerroute); 
app.use('/backend/services', serviceroute);
app.use('/backend/client', clientroute);
app.use('/backend/team', teamroute);
app.use('/backend/form', formroute);
app.use('/backend/product', productroute);
app.use('/backend/subuser', subuserroute);
app.use('/backend/store', storeroute);
app.use('/backend/payment', paymentroute);
app.use('/backend/order', orderroute);
app.use('/backend/media', mediaroute);

// ✅ Error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
