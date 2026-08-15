const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Property = require('../models/Property');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/reviews/property/:propertyId
// @desc    Get reviews for a property
router.get('/property/:propertyId', async (req, res) => {
  try {
    const reviews = await Review.find({ propertyId: req.params.propertyId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/reviews/property/:propertyId
// @desc    Post a review for a property
router.post('/property/:propertyId', protect, async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { rating, cleanlinessRating, locationRating, landlordRating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ message: 'Rating and review comment are required' });
    }

    const review = await Review.create({
      propertyId,
      tenantId: req.user._id,
      tenantName: req.user.name,
      tenantCountry: req.user.nationality || 'Foreign Expat',
      tenantAvatar: req.user.avatar || '',
      rating: Number(rating),
      cleanlinessRating: Number(cleanlinessRating || rating),
      locationRating: Number(locationRating || rating),
      landlordRating: Number(landlordRating || rating),
      comment
    });

    // Update Property average rating
    const allReviews = await Review.find({ propertyId });
    const avgRating = allReviews.reduce((acc, item) => acc + item.rating, 0) / allReviews.length;

    await Property.findByIdAndUpdate(propertyId, {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: allReviews.length
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
