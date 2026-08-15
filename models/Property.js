const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  city: { 
    type: String, 
    enum: ['Chennai', 'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Goa', 'Kochi', 'Jaipur'], 
    default: 'Chennai',
    required: true 
  },
  neighborhood: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    lat: { type: Number, default: 13.0827 },
    lng: { type: Number, default: 80.2707 }
  },
  pricePerNight: { type: Number, required: true },
  pricePerMonth: { type: Number, required: true },
  deposit: { type: Number, required: true },
  bedrooms: { type: Number, required: true, default: 1 },
  bathrooms: { type: Number, required: true, default: 1 },
  maxGuests: { type: Number, required: true, default: 2 },
  propertyType: { 
    type: String, 
    default: 'Serviced Apartment'
  },
  leaseTerms: [{ type: String }],
  amenities: [{ type: String }],
  coverImage: { type: String, required: true },
  images: [{ type: String }],
  status: { 
    type: String, 
    enum: ['pending_verification', 'verified', 'rejected'], 
    default: 'verified' 
  },
  rating: { type: Number, default: 4.8 },
  reviewCount: { type: Number, default: 12 },
  frroSupported: { type: Boolean, default: true },
  instantBooking: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  isShortTerm: { type: Boolean, default: true },
  isLongTerm: { type: Boolean, default: true },
  isForeignerFriendly: { type: Boolean, default: true },
  virtualTourUrl: { type: String, default: '' },
  nearbyAttractions: [{
    name: { type: String },
    type: { type: String },
    distance: { type: String }
  }],
  nearbyRestaurants: [{
    name: { type: String },
    cuisine: { type: String },
    distance: { type: String },
    rating: { type: Number }
  }],
  houseRules: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

// Indexing for high-performance search queries
PropertySchema.index({ city: 1, pricePerMonth: 1, propertyType: 1, rating: -1, status: 1 });
PropertySchema.index({ 'location.lat': 1, 'location.lng': 1 });

module.exports = mongoose.model('Property', PropertySchema);
