const CampusUpdate = require('../models/CampusUpdate.model');

// CREATE (Admin)
exports.createCampusUpdate = async (req, res) => {
  const update = await CampusUpdate.create(req.body);
  res.status(201).json({
    success: true,
    data: update
  });
};

// GET (Public)
exports.getCampusUpdates = async (req, res) => {
  const { campus, type } = req.query;

  if (!campus) {
    return res.status(400).json({
      success: false,
      message: 'Campus is required'
    });
  }

  const filter = {
    campus,
    status: 'published'
  };

  if (type) filter.type = type;

  const updates = await CampusUpdate.find(filter)
    .sort({ isPinned: -1, createdAt: -1 });

  res.json({
    success: true,
    data: updates
  });
};

// UPDATE (Admin)
exports.updateCampusUpdate = async (req, res) => {
  const update = await CampusUpdate.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json({
    success: true,
    data: update
  });
};

// DELETE (Admin)
exports.deleteCampusUpdate = async (req, res) => {
  await CampusUpdate.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Campus update deleted'
  });
};
