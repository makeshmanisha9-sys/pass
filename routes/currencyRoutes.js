const express = require('express');
const router = express.Router();
const CurrencyRate = require('../models/CurrencyRate');

// @route   GET /api/currency/rates
// @desc    Get latest currency exchange rates (INR base)
router.get('/rates', async (req, res) => {
  try {
    let rateDoc = await CurrencyRate.findOne({});
    if (!rateDoc) {
      rateDoc = await CurrencyRate.create({
        baseCurrency: 'INR',
        rates: {
          INR: 1.0,
          USD: 0.012,
          EUR: 0.011,
          GBP: 0.0094,
          AUD: 0.018,
          CAD: 0.016,
          SGD: 0.016,
          JPY: 1.78
        }
      });
    }
    res.json(rateDoc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
