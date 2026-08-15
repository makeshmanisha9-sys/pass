const express = require('express');
const router = express.Router();
const Availability = require('../models/Availability');
const Booking = require('../models/Booking');
const { protect, authorize } = require('../middleware/authMiddleware');

// @route   GET /api/availability/:propertyId
// @desc    Get blocked dates & existing bookings for a property
router.get('/:propertyId', async (req, res) => {
  try {
    const { propertyId } = req.params;

    const availability = await Availability.findOne({ propertyId }) || { blockedRanges: [] };

    // Also fetch confirmed bookings for this property
    const bookings = await Booking.find({
      propertyId,
      status: { $ne: 'cancelled' }
    }).select('checkIn checkOut');

    const bookedRanges = bookings.map(b => ({
      startDate: b.checkIn,
      endDate: b.checkOut,
      reason: 'Confirmed Reservation'
    }));

    res.json({
      propertyId,
      blockedRanges: [...availability.blockedRanges, ...bookedRanges]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/availability/:propertyId/block
// @desc    Block date range for a property (Owner/Admin)
router.post('/:propertyId/block', protect, authorize('owner', 'admin'), async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { startDate, endDate, reason } = req.body;

    let availability = await Availability.findOne({ propertyId });
    if (!availability) {
      availability = new Availability({ propertyId, blockedRanges: [] });
    }

    availability.blockedRanges.push({
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason: reason || 'Owner maintenance'
    });

    await availability.save();
    res.json(availability);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
