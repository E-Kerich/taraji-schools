// src/controllers/blog.controller.js
const Blog = require('../models/Blog.model');

exports.createBlog = async (req, res) => {
  const blog = await Blog.create(req.body);
  res.status(201).json({ success: true, data: blog });
};

exports.getBlogs = async (req, res) => {
  const { campus, status } = req.query;

  const filter = {};
  if (campus) filter.campus = campus;
  if (status) filter.status = status;

  const blogs = await Blog.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, data: blogs });
};

exports.getBlogBySlug = async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug });
  if (!blog) {
    return res.status(404).json({ success: false, message: 'Blog not found' });
  }
  res.json({ success: true, data: blog });
};

exports.updateBlog = async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, data: blog });
};

exports.deleteBlog = async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Blog deleted' });
};
