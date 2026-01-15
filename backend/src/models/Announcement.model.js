// src/models/Announcement.model.js
const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    campus: {
      type: String,
      enum: ['westlands', 'redhill', 'all'],
      default: 'all'
    },
    expiresAt: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Announcement', announcementSchema);
