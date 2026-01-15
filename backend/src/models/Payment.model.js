// src/models/Payment.model.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    parentName: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: {
      type: String,
      default: 'KES'
    },
    purpose: { type: String },
    campus: {
      type: String,
      enum: ['westlands', 'redhill'],
      required: true
    },
    method: {
      type: String,
      enum: ['cash', 'bank_transfer', 'mpesa'],
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
