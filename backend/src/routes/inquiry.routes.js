// src/routes/inquiry.routes.js
const express = require('express');
const {
  submitInquiry,
  getInquiries,
  updateInquiryStatus
} = require('../controllers/inquiry.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Public
router.post('/', submitInquiry);

// Admin
router.get('/', protect, getInquiries);
router.put('/:id', protect, updateInquiryStatus);

module.exports = router;
