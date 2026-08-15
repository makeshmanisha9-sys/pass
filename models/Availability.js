const mongoose = require('mongoose');

const AvailabilitySchema = new mongoose.Schema({
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true, unique: true },
  blockedRanges: [{
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, default: 'Maintenance / Booked' }
  }],
  availableFrom: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Availability', AvailabilitySchema);
