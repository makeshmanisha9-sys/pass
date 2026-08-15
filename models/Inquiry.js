const mongoose = require('mongoose');

const InquirySchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  countryOfOrigin: { type: String, required: true },
  preferredCity: { 
    type: String, 
    enum: ['Chennai', 'Bangalore', 'Mumbai', 'Delhi', 'Goa', 'Hyderabad'],
    required: true 
  },
  moveInDate: { type: String },
  monthlyBudget: { type: String },
  message: { type: String },
  status: { 
    type: String, 
    enum: ['new', 'contacted', 'shortlisted', 'resolved'], 
    default: 'new' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inquiry', InquirySchema);
