// src/controllers/inquiry.controller.js
const Inquiry = require('../models/Inquiry.model');
const { sendEmail } = require('../services/email.service');

exports.submitInquiry = async (req, res) => {
  const inquiry = await Inquiry.create(req.body);

  await sendEmail({
    to: 'admissions@brookside.ac.ke',
    subject: 'New Admission Inquiry',
    html: `
      <h3>New Inquiry</h3>
      <p><strong>Parent:</strong> ${inquiry.parentName}</p>
      <p><strong>Email:</strong> ${inquiry.email}</p>
      <p><strong>Campus:</strong> ${inquiry.campus}</p>
      <p><strong>Year Applying:</strong> ${inquiry.yearApplying}</p>
    `
  });

  res.status(201).json({
    success: true,
    message: 'Inquiry submitted successfully'
  });
};


exports.getInquiries = async (req, res) => {
  const { campus } = req.query;
  const filter = campus ? { campus } : {};

  const inquiries = await Inquiry.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, data: inquiries });
};

exports.updateInquiryStatus = async (req, res) => {
  const inquiry = await Inquiry.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  res.json({ success: true, data: inquiry });
};
