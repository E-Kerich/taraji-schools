// src/services/email.service.js
const resend = require('../config/resend');

exports.sendEmail = async ({ to, subject, html }) => {
  return resend.emails.send({
    from: 'Brookside Schools <noreply@brookside.ac.ke>',
    to,
    subject,
    html
  });
};
