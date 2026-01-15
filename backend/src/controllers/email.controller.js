// src/controllers/email.controller.js
const EmailList = require('../models/EmailList.model');

exports.subscribeEmail = async (req, res) => {
  const email = await EmailList.findOneAndUpdate(
    { email: req.body.email },
    req.body,
    { upsert: true, new: true }
  );

  res.status(201).json({
    success: true,
    message: 'Subscribed successfully',
    data: email
  });
};

exports.getEmails = async (req, res) => {
  const emails = await EmailList.find().sort({ createdAt: -1 });
  res.json({ success: true, data: emails });
};
