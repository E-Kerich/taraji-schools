// src/controllers/upload.controller.js
const { uploadImage } = require('../services/cloudinary.service');

exports.uploadSingleImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
  }

  const result = await uploadImage(
    req.file.buffer,      // ✅ buffer, not path
    'brookside/media'
  );

  res.status(201).json({
    success: true,
    data: {
      url: result.secure_url,
      public_id: result.public_id
    }
  });
};
