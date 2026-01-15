// src/routes/page.routes.js
const express = require('express');
const {
  createPage,
  getPageBySlug
} = require('../controllers/page.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Public
router.get('/:slug', getPageBySlug);

// Admin
router.post('/', protect, createPage);

module.exports = router;
