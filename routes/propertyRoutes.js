const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const AuditLog = require('../models/AuditLog');
const { protect, authorize } = require('../middleware/authMiddleware');

// @route   GET /api/properties
// @desc    Get all properties with filtering, search & sorting
router.get('/', async (req, res) => {
  try {
    const { 
      city, search, minPrice, maxPrice, bedrooms, bathrooms, 
      propertyType, leaseTerm, amenity, sort, status, rating,
      instantBooking, shortTerm, longTerm, featured 
    } = req.query;

    let query = {};

    // Filter by verification status (default to verified for public view unless requested)
    if (status && status !== 'all') {
      query.status = status;
    } else if (!status) {
      query.status = 'verified';
    }

    if (city && city !== 'All') {
      query.city = new RegExp(`^${city}$`, 'i');
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { neighborhood: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } }
      ];
    }

    if (minPrice || maxPrice) {
      query.pricePerMonth = {};
      if (minPrice) query.pricePerMonth.$gte = Number(minPrice);
      if (maxPrice) query.pricePerMonth.$lte = Number(maxPrice);
    }

    if (bedrooms && bedrooms !== 'All') {
      query.bedrooms = { $gte: Number(bedrooms) };
    }

    if (bathrooms && bathrooms !== 'All') {
      query.bathrooms = { $gte: Number(bathrooms) };
    }

    if (propertyType && propertyType !== 'All') {
      const cleanType = propertyType.replace(/s$/i, '').trim();
      query.propertyType = new RegExp(cleanType, 'i');
    }

    if (rating && rating !== 'All') {
      query.rating = { $gte: Number(rating) };
    }

    if (leaseTerm) {
      query.leaseTerms = leaseTerm;
    }

    if (amenity) {
      const amenitiesList = Array.isArray(amenity) ? amenity : [amenity];
      query.amenities = { $all: amenitiesList };
    }

    if (instantBooking === 'true') {
      query.instantBooking = true;
    }

    if (shortTerm === 'true') {
      query.isShortTerm = true;
    }

    if (longTerm === 'true') {
      query.isLongTerm = true;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'price_asc') sortOptions = { pricePerMonth: 1 };
    if (sort === 'price_desc') sortOptions = { pricePerMonth: -1 };
    if (sort === 'rating') sortOptions = { rating: -1 };
    if (sort === 'newest') sortOptions = { createdAt: -1 };

    const properties = await Property.find(query)
      .populate('ownerId', 'name email phone avatar')
      .sort(sortOptions);
      
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/properties/:id
// @desc    Get single property by ID
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('ownerId', 'name email phone avatar isVerified');
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/properties
// @desc    Create property (All authenticated users)
router.post('/', protect, async (req, res) => {
  try {
    const propertyData = {
      ...req.body,
      ownerId: req.user._id,
      status: req.user.role === 'admin' ? 'verified' : 'pending_verification'
    };

    const property = await Property.create(propertyData);

    await AuditLog.create({
      userId: req.user._id,
      action: 'PROPERTY_CREATED',
      entity: 'Property',
      entityId: property._id.toString(),
      details: `Created property ${property.title} in ${property.city}`
    });

    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/properties/:id
// @desc    Update property (Owner/Admin)
router.put('/:id', protect, authorize('owner', 'admin'), async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this property' });
    }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/properties/:id
// @desc    Delete property (Owner/Admin)
router.delete('/:id', protect, authorize('owner', 'admin'), async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this property' });
    }

    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PATCH /api/properties/:id/verify
// @desc    Verify or Reject property (Admin only)
router.patch('/:id/verify', protect, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.body; // 'verified' or 'rejected'
    if (!['verified', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const property = await Property.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    await AuditLog.create({
      userId: req.user._id,
      action: `PROPERTY_${status.toUpperCase()}`,
      entity: 'Property',
      entityId: property._id.toString(),
      details: `Admin changed status to ${status}`
    });

    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
