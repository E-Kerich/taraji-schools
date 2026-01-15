// src/models/Inquiry.model.js
const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    parentName: { type: String, required: true },
    email: { type: String, required: true },
    childAge: { type: Number, required: true },
    yearApplying: { type: String, required: true },
    campus: {
      type: String,
      enum: ['westlands', 'redhill'],
      required: true
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'enrolled'],
      default: 'new'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inquiry', inquirySchema);
