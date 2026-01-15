// src/routes/blog.routes.js
const express = require('express');
const {
  createBlog,
  getBlogs,
  getBlogBySlug,
  updateBlog,
  deleteBlog
} = require('../controllers/blog.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Public
router.get('/', getBlogs);
router.get('/:slug', getBlogBySlug);

// Admin
router.post('/', protect, createBlog);
router.put('/:id', protect, updateBlog);
router.delete('/:id', protect, deleteBlog);

module.exports = router;
