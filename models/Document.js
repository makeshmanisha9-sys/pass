const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  documentType: { 
    type: String, 
    enum: ['passport', 'visa', 'frro', 'lease_agreement'], 
    required: true 
  },
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'verified', 'rejected'], 
    default: 'verified' 
  },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Document', DocumentSchema);
