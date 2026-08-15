const mongoose = require('mongoose');

const CurrencyRateSchema = new mongoose.Schema({
  baseCurrency: { type: String, default: 'INR' },
  rates: {
    INR: { type: Number, default: 1.0 },
    USD: { type: Number, default: 0.012 },
    EUR: { type: Number, default: 0.011 },
    GBP: { type: Number, default: 0.0094 },
    AUD: { type: Number, default: 0.018 },
    CAD: { type: Number, default: 0.016 },
    SGD: { type: Number, default: 0.016 },
    JPY: { type: Number, default: 1.78 }
  },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CurrencyRate', CurrencyRateSchema);
