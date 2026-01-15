// src/models/Contact.model.js
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    message: { type: String, required: true },
    campus: {
      type: String,
      enum: ['westlands', 'redhill'],
      required: true
    },
    status: {
      type: String,
      enum: ['new', 'responded'],
      default: 'new'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contact', contactSchema);
