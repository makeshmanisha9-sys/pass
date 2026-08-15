const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');
const AuditLog = require('../models/AuditLog');
const { protect, authorize } = require('../middleware/authMiddleware');

// @route   POST /api/inquiries
// @desc    Submit Get Matched / Concierge inquiry
router.post('/', async (req, res) => {
  try {
    const { fullName, email, countryOfOrigin, preferredCity, moveInDate, monthlyBudget, message } = req.body;

    if (!fullName || !email || !preferredCity) {
      return res.status(400).json({ message: 'Name, email, and preferred city are required.' });
    }

    const inquiry = await Inquiry.create({
      fullName,
      email,
      countryOfOrigin: countryOfOrigin || 'Foreign Expat',
      preferredCity,
      moveInDate: moveInDate || '',
      monthlyBudget: monthlyBudget || '',
      message: message || ''
    });

    await AuditLog.create({
      action: 'INQUIRY_SUBMITTED',
      entity: 'Inquiry',
      entityId: inquiry._id.toString(),
      details: `New inquiry from ${fullName} for ${preferredCity}`
    });

    res.status(201).json({
      success: true,
      message: 'Inquiry received successfully! A local concierge will reply within 24 hours.',
      inquiry
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/inquiries
// @desc    Get all inquiries (Admin only)
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PATCH /api/inquiries/:id/status
// @desc    Update inquiry status (Admin only)
router.patch('/:id/status', protect, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
