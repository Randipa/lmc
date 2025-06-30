const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');

// Import Routes
const authRoutes = require('../routes/authRoutes');
const userRoutes = require('../routes/userRoutes');
const courseRoutes = require('../routes/courseRoutes');
const paymentRoutes = require('../routes/paymentRoutes');
const bankPaymentRoutes = require('../routes/bankPaymentRoutes');
const bunnyRoutes = require('../routes/bunnyRoutes');
const teacherRoutes = require('../routes/teacherRoutes');
const noticeRoutes = require('../routes/noticeRoutes');
const productRoutes = require('../routes/productRoutes');

const app = express();

// CORS Configuration for Vercel
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com'] 
    : ['http://localhost:3000'],
  credentials: true
}));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Database connection with caching for serverless
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000, // 45 seconds
      maxPoolSize: 10,
      minPoolSize: 1,
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0 // Disable mongoose buffering
    });
    
    cachedDb = db;
    console.log('✅ MongoDB connected');
    return db;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

// Session middleware (simplified for serverless)
app.use((req, res, next) => {
  // Simple session alternative - you might want to use JWT instead
  req.session = {};
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/bank-payment', bankPaymentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/bunny', bunnyRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/products', productRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Main handler for Vercel
module.exports = async (req, res) => {
  try {
    // Connect to database on each request (with caching)
    await connectToDatabase();
    
    // Process the request through Express
    return app(req, res);
  } catch (error) {
    console.error('❌ Handler error:', error);
    return res.status(500).json({ 
      error: 'Database connection failed',
      message: error.message
    });
  }
};