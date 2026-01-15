// src/controllers/payment.controller.js
const Payment = require('../models/Payment.model');

exports.recordPayment = async (req, res) => {
  const payment = await Payment.create(req.body);
  res.status(201).json({ success: true, data: payment });
};

exports.getPayments = async (req, res) => {
  const { campus } = req.query;
  const filter = campus ? { campus } : {};

  const payments = await Payment.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, data: payments });
};
