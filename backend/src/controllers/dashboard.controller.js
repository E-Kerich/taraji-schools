const Blog = require('../models/Blog.model');
const Inquiry = require('../models/Inquiry.model');
const Contact = require('../models/Contact.model');
const Payment = require('../models/Payment.model');
const EmailList = require('../models/EmailList.model');

exports.getDashboardSummary = async (req, res) => {
  const [
    blogs,
    newInquiries,
    newContacts,
    emailSubscribers,
    payments
  ] = await Promise.all([
    Blog.countDocuments(),
    Inquiry.countDocuments({ status: 'new' }),
    Contact.countDocuments({ status: 'new' }),
    EmailList.countDocuments(),
    Payment.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ])
  ]);

  res.json({
    success: true,
    data: {
      blogs,
      newInquiries,
      newContacts,
      emailSubscribers,
      paymentsThisMonth: payments[0]?.total || 0
    }
  });
};
