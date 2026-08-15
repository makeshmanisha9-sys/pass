const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/wishlist
// @desc    Get user's wishlist properties
router.get('/', protect, async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ tenantId: req.user._id }).populate('properties');
    if (!wishlist) {
      wishlist = await Wishlist.create({ tenantId: req.user._id, properties: [] });
    }
    res.json(wishlist.properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Helper toggle handler
const handleToggleWishlist = async (req, res) => {
  try {
    const propertyId = req.params.propertyId || req.body.propertyId;
    
    if (!propertyId) {
      return res.status(400).json({ message: 'Property ID is required' });
    }

    let wishlist = await Wishlist.findOne({ tenantId: req.user._id });

    if (!wishlist) {
      wishlist = new Wishlist({ tenantId: req.user._id, properties: [] });
    }

    const index = wishlist.properties.indexOf(propertyId);
    let added = false;

    if (index > -1) {
      wishlist.properties.splice(index, 1);
    } else {
      wishlist.properties.push(propertyId);
      added = true;
    }

    wishlist.updatedAt = Date.now();
    await wishlist.save();

    const updatedWishlist = await Wishlist.findOne({ tenantId: req.user._id }).populate('properties');

    res.json({
      success: true,
      added,
      wishlist: updatedWishlist.properties
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/wishlist/toggle
// @route   POST /api/wishlist/toggle/:propertyId
router.post('/toggle', protect, handleToggleWishlist);
router.post('/toggle/:propertyId', protect, handleToggleWishlist);

module.exports = router;
