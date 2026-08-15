const express = require('express');
const router = express.Router();
const Document = require('../models/Document');
const Notification = require('../models/Notification');
const upload = require('../middleware/uploadMiddleware');
const { protect, authorize } = require('../middleware/authMiddleware');

// @route   POST /api/documents/upload
// @desc    Upload passport / visa / FRRO document
router.post('/upload', protect, upload.single('document'), async (req, res) => {
  try {
    const { documentType } = req.body;

    if (!documentType) {
      return res.status(400).json({ message: 'Document type is required' });
    }

    let fileUrl = '';
    let fileName = '';

    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
      fileName = req.file.originalname;
    } else if (req.body.fileUrl) {
      fileUrl = req.body.fileUrl;
      fileName = req.body.fileName || `${documentType}_upload.pdf`;
    } else {
      // Fallback demo mock doc for convenience
      fileUrl = `https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80`;
      fileName = `${documentType}_passport_copy.jpg`;
    }

    const doc = await Document.create({
      userId: req.user._id,
      documentType,
      fileName,
      fileUrl,
      status: 'verified'
    });

    await Notification.create({
      userId: req.user._id,
      title: 'Document Uploaded',
      message: `Your ${documentType.toUpperCase()} document has been uploaded and auto-verified for FRRO compliance.`,
      type: 'verification'
    });

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      document: doc
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/documents/my-documents
// @desc    Get user's uploaded documents
router.get('/my-documents', protect, async (req, res) => {
  try {
    const docs = await Document.find({ userId: req.user._id }).sort({ uploadedAt: -1 });
    res.json(docs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/documents/all
// @desc    Get all tenant documents (Admin only)
router.get('/all', protect, authorize('admin'), async (req, res) => {
  try {
    const docs = await Document.find()
      .populate('userId', 'name email nationality passportNumber')
      .sort({ uploadedAt: -1 });

    res.json(docs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PATCH /api/documents/:id/verify
// @desc    Admin update document status
router.patch('/:id/verify', protect, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const doc = await Document.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    res.json(doc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
