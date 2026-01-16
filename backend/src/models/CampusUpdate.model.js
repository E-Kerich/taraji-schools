const mongoose = require('mongoose');

const campusUpdateSchema = new mongoose.Schema(
  {
    campus: {
      type: String,
      enum: ['westlands', 'redhill'],
      required: true
    },
    type: {
      type: String,
      enum: ['news', 'curriculum', 'announcement', 'notice'],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    isPinned: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'published'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('CampusUpdate', campusUpdateSchema);
