// src/models/Blog.model.js
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    coverImage: { type: String },
    campus: {
      type: String,
      enum: ['westlands', 'redhill', 'all'],
      default: 'all'
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Blog', blogSchema);
