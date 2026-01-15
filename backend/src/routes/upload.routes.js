// src/routes/upload.routes.js
const express = require('express');
const upload = require('../middleware/upload.middleware');
const { uploadSingleImage } = require('../controllers/upload.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();
router.post(
    '/image',
    protect,
    upload.single('image'), // ✅ multer BEFORE controller
    uploadSingleImage
  );
  

module.exports = router;
