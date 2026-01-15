// src/routes/announcement.routes.js
const express = require('express');
const {
  createAnnouncement,
  getActiveAnnouncements
} = require('../controllers/announcement.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Public
router.get('/', getActiveAnnouncements);

// Admin
router.post('/', protect, createAnnouncement);

module.exports = router;
