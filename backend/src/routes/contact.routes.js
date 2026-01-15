// src/routes/contact.routes.js
const express = require('express');
const {
  submitContact,
  getContacts,
  updateContactStatus
} = require('../controllers/contact.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Public
router.post('/', submitContact);

// Admin
router.get('/', protect, getContacts);
router.put('/:id', protect, updateContactStatus);

module.exports = router;
