const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Health check endpoint for Render (must be top-level before static files & DB calls)
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded files & frontend public folder
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to ensure DB connection is ready before processing API requests
app.use('/api', async (req, res, next) => {
  const conn = await connectDB();
  if (!conn || mongoose.connection.readyState !== 1) {
    return res.status(503).json({ 
      message: 'Database connecting to MongoDB Cloud. Please check MONGODB_URI on Render & Atlas IP Access List (0.0.0.0/0).' 
    });
  }
  next();
});

// API Route Register
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/properties', require('./routes/propertyRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/currency', require('./routes/currencyRoutes'));
app.use('/api/documents', require('./routes/documentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// SPA Fallback: Serve index.html for all frontend page navigation
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

const PORT = parseInt(process.env.PORT, 10) || 5000;

// Start Server immediately so Render health check (/healthz) succeeds in 10ms without 502 Bad Gateway
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`🚀 Passage Server running at: http://0.0.0.0:${PORT}`);
  console.log(`====================================================`);

  // Asynchronously connect DB & perform auto-seed check in background
  connectDB().then(async (conn) => {
    if (conn) {
      try {
        const Property = require('./models/Property');
        const count = await Property.countDocuments();
        if (count === 0) {
          console.log('Database empty on startup. Auto-seeding Passage demo dataset...');
          const seedFunc = require('./seedDataHelper');
          await seedFunc();
        }
      } catch (seedErr) {
        console.error('Auto-seed check warning:', seedErr.message);
      }
    }
  }).catch(err => {
    console.error('Background DB connection error:', err.message);
  });
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`💡 Passage Server is ALREADY running on port ${PORT}!`);
    console.log(`👉 Open http://localhost:${PORT} in your browser.`);
  } else {
    console.error(`❌ Server startup error: ${err.message}`);
  }
});
