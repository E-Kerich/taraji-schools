// src/routes/payment.routes.js
const express = require('express');
const {
  recordPayment,
  getPayments
} = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Admin only
router.post('/', protect, recordPayment);
router.get('/', protect, getPayments);

module.exports = router;
