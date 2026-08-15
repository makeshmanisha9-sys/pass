const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Property = require('../models/Property');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Inquiry = require('../models/Inquiry');
const Document = require('../models/Document');
const AuditLog = require('../models/AuditLog');
const { protect, authorize } = require('../middleware/authMiddleware');

const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTenants = await User.countDocuments({ role: 'tenant' });
    const totalOwners = await User.countDocuments({ role: 'owner' });
    
    const totalProperties = await Property.countDocuments();
    const verifiedProperties = await Property.countDocuments({ status: 'verified' });
    const pendingProperties = await Property.countDocuments({ status: 'pending_verification' });

    const totalBookings = await Booking.countDocuments();
    const activeBookings = await Booking.countDocuments({ status: 'confirmed' });

    const totalInquiries = await Inquiry.countDocuments();
    const newInquiries = await Inquiry.countDocuments({ status: 'new' });

    const pendingDocs = await Document.countDocuments({ status: 'pending' });

    const revenueResult = await Payment.aggregate([
      { $match: { status: 'success' } },
      { $group: { _id: null, totalRevenue: { $sum: '$amount' } } }
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // City breakdown
    const cityBreakdown = await Property.aggregate([
      { $group: { _id: '$city', count: { $sum: 1 } } }
    ]);

    res.json({
      metrics: {
        totalUsers,
        totalTenants,
        totalOwners,
        totalProperties,
        verifiedProperties,
        pendingProperties,
        totalBookings,
        activeBookings,
        totalRevenue,
        totalInquiries,
        newInquiries,
        pendingDocs
      },
      cityBreakdown,
      totalProperties,
      totalUsers,
      totalRevenue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/admin/analytics & /api/admin/stats
router.get('/analytics', protect, authorize('admin'), getAnalytics);
router.get('/stats', protect, authorize('admin'), getAnalytics);

// @route   GET /api/admin/users
router.get('/users', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/admin/logs
router.get('/logs', protect, authorize('admin'), async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(100);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
