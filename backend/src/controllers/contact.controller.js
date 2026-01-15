// src/controllers/contact.controller.js
const Contact = require('../models/Contact.model');
const { sendEmail } = require('../services/email.service');

exports.submitContact = async (req, res) => {
  const contact = await Contact.create(req.body);

  await sendEmail({
    to: 'admin@brookside.ac.ke',
    subject: 'New Contact Message',
    html: `
      <h3>New Contact</h3>
      <p><strong>Name:</strong> ${contact.name}</p>
      <p><strong>Email:</strong> ${contact.email}</p>
      <p><strong>Campus:</strong> ${contact.campus}</p>
      <p>${contact.message}</p>
    `
  });

  res.status(201).json({
    success: true,
    message: 'Message sent successfully'
  });
};


exports.getContacts = async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  res.json({ success: true, data: contacts });
};

exports.updateContactStatus = async (req, res) => {
  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  res.json({ success: true, data: contact });
};
