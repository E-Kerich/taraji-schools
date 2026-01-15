// src/routes/email.routes.js
const express = require('express');
const {
  subscribeEmail,
  getEmails
} = require('../controllers/email.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Public
router.post('/subscribe', subscribeEmail);

// Admin
router.get('/', protect, getEmails);

module.exports = router;
