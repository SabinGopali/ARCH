import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';




import userroute from './routes/user.route.js';
import authroute from './routes/auth.route.js';
import careerroute from './routes/career.route.js';
import partnerroute from './routes/partner.route.js';
import serviceroute from './routes/services.route.js';
import clientroute from './routes/client.route.js';
import teamroute from './routes/team.route.js';
import formroute from './routes/form.route.js'
import productroute from './routes/product.route.js'
import subuserroute from './routes/subuser.route.js'
import storeroute from './routes/store.route.js'
import paymentroute from './routes/payment.route.js'





dotenv.config();

mongoose.connect(process.env.MONGO)
  .then(() => console.log('MongoDb is connected'))
  .catch(err => console.log(err));

const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());

// ✅ Serve uploaded images statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));



// Routes
app.use('/backend/user', userroute);
app.use('/backend/auth', authroute);
app.use('/backend/Career', careerroute);
app.use('/backend/Partners', partnerroute); 
app.use('/backend/services', serviceroute);
app.use('/backend/client', clientroute);
app.use('/backend/team', teamroute);
app.use('/backend/form', formroute);
app.use('/backend/product', productroute);
app.use('/backend/subuser', subuserroute);
app.use('/backend/store', storeroute);
app.use('/backend/payment', paymentroute);





// Error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
