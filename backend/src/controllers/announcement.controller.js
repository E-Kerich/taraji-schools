// src/controllers/announcement.controller.js
const Announcement = require('../models/Announcement.model');

exports.createAnnouncement = async (req, res) => {
  const announcement = await Announcement.create(req.body);
  res.status(201).json({ success: true, data: announcement });
};

exports.getActiveAnnouncements = async (req, res) => {
  const { campus } = req.query;
  const now = new Date();

  const filter = {
    $or: [
      { expiresAt: { $gte: now } },
      { expiresAt: null }
    ]
  };

  if (campus) filter.campus = { $in: [campus, 'all'] };

  const announcements = await Announcement.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, data: announcements });
};
