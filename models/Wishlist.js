const mongoose = require('mongoose');

const WishlistSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  properties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Wishlist', WishlistSchema);
