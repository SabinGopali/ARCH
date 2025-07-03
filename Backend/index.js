import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import userroute from './routes/user.route.js';
import authroute from './routes/auth.route.js';
import careerroute from './routes/career.route.js';
import cookieParser from 'cookie-parser';
// import applicationRouter from './routes/application.route.js';
// import bookingRouter from './routes/booking.route.js';

dotenv.config();

mongoose.connect(process.env.MONGO).then(
    () => {console.log('MongoDb is connected')}
).catch(err => {
    console.log(err);
})

const app = express();


app.use(cookieParser());

app.listen(3000, () => {
    console.log('Server is running in port 3000');
})

app.use(express.json());
app.use('/backend/user', userroute);
app.use('/backend/auth', authroute);
app.use('/backend/Career', careerroute);
// app.use('/api/application', applicationRouter);
// app.use('/api/booking', bookingRouter);

app.use ((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
      success: false,
      statusCode,
      message,
    });
  });