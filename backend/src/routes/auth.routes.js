// src/routes/auth.routes.js
const express = require('express');
const { loginAdmin, getMe } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/login', loginAdmin);
router.get('/me', protect, getMe);

module.exports = router;
