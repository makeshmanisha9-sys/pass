const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Property = require('../models/Property');
const Availability = require('../models/Availability');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { protect, JWT_SECRET } = require('../middleware/authMiddleware');

// Helper to format booking ref number
const generateBookingNumber = () => {
  return 'PAS-' + Math.floor(100000 + Math.random() * 900000);
};

// @route   POST /api/bookings
// @desc    Create booking with double-booking prevention check (Supports guest & authenticated users)
router.post('/', async (req, res) => {
  try {
    const { propertyId, checkIn, checkOut, totalAmount, guests, specialRequests } = req.body;

    if (!propertyId || !checkIn || !checkOut || !totalAmount) {
      return res.status(400).json({ message: 'Missing required booking details' });
    }

    // Determine tenant ID (from JWT token if logged in, or fallback to default expat tenant)
    let tenantId = null;
    let authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        tenantId = decoded.id;
      } catch (e) {}
    }

    if (!tenantId) {
      const defaultTenant = await User.findOne({ role: 'tenant' });
      if (defaultTenant) {
        tenantId = defaultTenant._id;
      }
    }

    if (!tenantId) {
      return res.status(401).json({ message: 'Please sign in or create an account to reserve.' });
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    if (start >= end) {
      return res.status(400).json({ message: 'Check-out date must be after check-in date' });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check double booking against existing confirmed/pending bookings
    const overlappingBooking = await Booking.findOne({
      propertyId,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        { checkIn: { $lt: end }, checkOut: { $gt: start } }
      ]
    });

    if (overlappingBooking) {
      return res.status(400).json({ 
        message: 'Selected dates are unavailable for this residence. Please choose another stay duration.' 
      });
    }

    // Create Booking Document
    const bookingNumber = generateBookingNumber();
    const booking = await Booking.create({
      bookingNumber,
      propertyId,
      tenantId,
      ownerId: property.ownerId,
      checkIn: start,
      checkOut: end,
      totalAmount,
      guests: Number(guests) || 1,
      specialRequests: specialRequests || '',
      status: 'confirmed',
      paymentStatus: 'paid'
    });

    // Create Notification for Landlord Host
    await Notification.create({
      userId: property.ownerId,
      type: 'BOOKING_CREATED',
      title: 'New Expat Reservation Received!',
      message: `New booking #${bookingNumber} confirmed for "${property.title}" from ${start.toLocaleDateString()} to ${end.toLocaleDateString()}. FRRO Form C filing required.`,
      link: '/owner-dashboard'
    });

    await AuditLog.create({
      userId: tenantId,
      action: 'BOOKING_CREATED',
      entity: 'Booking',
      entityId: booking._id.toString(),
      details: `Booking ${bookingNumber} created for property ${propertyId}`
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('propertyId')
      .populate('ownerId', 'name email phone')
      .populate('tenantId', 'name email nationality');

    res.status(201).json(populatedBooking);

  } catch (error) {
    console.error('Booking Creation Error:', error);
    res.status(500).json({ message: error.message || 'Server error creating reservation' });
  }
});

// @route   GET /api/bookings/my-bookings
// @desc    Get tenant's bookings
router.get('/my-bookings', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ tenantId: req.user._id })
      .populate('propertyId')
      .populate('ownerId', 'name email phone avatar')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/bookings/owner-bookings
// @desc    Get owner's received bookings
router.get('/owner-bookings', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ ownerId: req.user._id })
      .populate('propertyId')
      .populate('tenantId', 'name email nationality passportNumber phone')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PATCH /api/bookings/:id/status
// @desc    Update booking status (owner or admin)
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    await booking.save();

    await Notification.create({
      userId: booking.tenantId,
      type: 'BOOKING_STATUS_CHANGED',
      title: `Reservation ${status.toUpperCase()}`,
      message: `Your booking #${booking.bookingNumber} status has been updated to ${status}.`,
      link: '/my-bookings'
    });

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
