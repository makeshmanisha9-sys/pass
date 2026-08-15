const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  tenantName: { type: String, required: true },
  tenantCountry: { type: String, default: 'Expat Tenant' },
  tenantAvatar: { type: String, default: '' },
  rating: { type: Number, required: true, min: 1, max: 5 }, // Overall Rating
  cleanliness: { type: Number, default: 5 },
  location: { type: Number, default: 5 },
  communication: { type: Number, default: 5 },
  value: { type: Number, default: 5 },
  comment: { type: String, required: true },
  verifiedStay: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', ReviewSchema);
