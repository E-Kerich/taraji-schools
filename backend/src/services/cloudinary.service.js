// src/services/cloudinary.service.js
const cloudinary = require('../config/cloudinary');

exports.uploadImage = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    ).end(buffer); // ✅ buffer here
  });
};
