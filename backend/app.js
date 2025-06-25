// app.js
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const bankPaymentRoutes = require('./routes/bankPaymentRoutes');
const bunnyRoutes = require('./routes/bunnyRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Session Middleware (required if using session in payment flow)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'fallback_session_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // true if in production (HTTPS)
      maxAge: 1000 * 60 * 10 // 10 minutes
    }
  })
);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/bank-payment', bankPaymentRoutes);
app.use('/api', courseRoutes);
app.use('/api', bunnyRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api', productRoutes);

// Connect to MongoDB (removed deprecated options)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Log environment variables status (without exposing values)
  console.log('🔧 Environment check:');
  console.log(`   MONGO_URI: ${process.env.MONGO_URI ? '✅ Set' : '❌ Missing'}`);
  console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? '✅ Set' : '❌ Missing'}`);
  console.log(`   BUNNY_API_KEY: ${process.env.BUNNY_API_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log(`   BUNNY_LIBRARY_ID: ${process.env.BUNNY_LIBRARY_ID ? '✅ Set' : '❌ Missing'}`);
  console.log(`   PAYHERE_MERCHANT_ID: ${process.env.PAYHERE_MERCHANT_ID ? '✅ Set' : '❌ Missing'}`);
});