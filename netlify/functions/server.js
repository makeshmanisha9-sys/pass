const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const connectDB = require('../../config/db');

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors());

// DB middleware with error handling
app.use(async (req, res, next) => {
  try {
    const conn = await connectDB();
    if (conn) {
      const Property = require('../../models/Property');
      const count = await Property.countDocuments().catch(() => 0);
      if (count === 0) {
        const seedFunc = require('../../seedDataHelper');
        await seedFunc().catch(e => console.log('Seed error:', e));
      }
    }
  } catch (e) {
    console.log('Netlify DB middleware catch:', e.message);
  }
  next();
});

// API Routes
app.use('/api/auth', require('../../routes/authRoutes'));
app.use('/api/properties', require('../../routes/propertyRoutes'));
app.use('/api/bookings', require('../../routes/bookingRoutes'));
app.use('/api/payments', require('../../routes/paymentRoutes'));
app.use('/api/documents', require('../../routes/documentRoutes'));
app.use('/api/wishlist', require('../../routes/wishlistRoutes'));
app.use('/api/reviews', require('../../routes/reviewRoutes'));
app.use('/api/ai', require('../../routes/aiRoutes'));
app.use('/api/currency', require('../../routes/currencyRoutes'));
app.use('/api/notifications', require('../../routes/notificationRoutes'));
app.use('/api/admin', require('../../routes/adminRoutes'));

module.exports.handler = serverless(app);
