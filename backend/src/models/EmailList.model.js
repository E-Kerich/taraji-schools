// src/models/EmailList.model.js
const mongoose = require('mongoose');

const emailListSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    source: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('EmailList', emailListSchema);
