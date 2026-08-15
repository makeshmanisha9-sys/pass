const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  bookingNumber: { type: String, required: true, unique: true },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  totalAmount: { type: Number, required: true }, // Amount in INR
  currency: { type: String, default: 'INR' },
  guests: { type: Number, default: 1 },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled', 'completed'], 
    default: 'confirmed' 
  },
  paymentStatus: { 
    type: String, 
    enum: ['unpaid', 'escrow', 'paid', 'refunded'], 
    default: 'paid' 
  },
  specialRequests: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', BookingSchema);
