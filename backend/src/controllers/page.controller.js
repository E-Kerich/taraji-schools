// src/controllers/page.controller.js
const Page = require('../models/Page.model');

exports.createPage = async (req, res) => {
  const page = await Page.create(req.body);
  res.status(201).json({ success: true, data: page });
};

exports.getPageBySlug = async (req, res) => {
  const page = await Page.findOne({
    slug: req.params.slug,
    status: 'published'
  });

  if (!page) {
    return res.status(404).json({ success: false, message: 'Page not found' });
  }

  res.json({ success: true, data: page });
};
