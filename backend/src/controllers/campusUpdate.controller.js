const CampusUpdate = require('../models/CampusUpdate.model');

/**
 * ============================
 * CREATE UPDATE (ADMIN)
 * ============================
 */
exports.createCampusUpdate = async (req, res) => {
  try {
    const update = await CampusUpdate.create(req.body);

    res.status(201).json({
      success: true,
      data: update
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to create campus update'
    });
  }
};

/**
 * ============================
 * GET UPDATES (ADMIN)
 * - No forced filters
 * - Supports optional campus & type filters
 * ============================
 */
exports.getAdminCampusUpdates = async (req, res) => {
  try {
    const { campus, type } = req.query;

    const filter = {};

    if (campus && campus !== 'all') {
      filter.campus = campus;
    }

    if (type && type !== 'all') {
      filter.type = type;
    }

    const updates = await CampusUpdate.find(filter)
      .sort({ isPinned: -1, createdAt: -1 });

    res.json({
      success: true,
      data: updates
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch campus updates'
    });
  }
};

/**
 * ============================
 * GET UPDATES (PUBLIC)
 * - Published only
 * - Campus REQUIRED
 * ============================
 */
exports.getPublicCampusUpdates = async (req, res) => {
  try {
    const { campus, type } = req.query;

    if (!campus) {
      return res.status(400).json({
        success: false,
        message: 'Campus is required'
      });
    }

    const filter = {
      campus,
      published: true
    };

    if (type) {
      filter.type = type;
    }

    const updates = await CampusUpdate.find(filter)
      .sort({ isPinned: -1, createdAt: -1 });

    res.json({
      success: true,
      data: updates
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch public updates'
    });
  }
};

/**
 * ============================
 * UPDATE UPDATE (ADMIN)
 * ============================
 */
exports.updateCampusUpdate = async (req, res) => {
  try {
    const update = await CampusUpdate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!update) {
      return res.status(404).json({
        success: false,
        message: 'Campus update not found'
      });
    }

    res.json({
      success: true,
      data: update
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to update campus update'
    });
  }
};

/**
 * ============================
 * DELETE UPDATE (ADMIN)
 * ============================
 */
exports.deleteCampusUpdate = async (req, res) => {
  try {
    const update = await CampusUpdate.findByIdAndDelete(req.params.id);

    if (!update) {
      return res.status(404).json({
        success: false,
        message: 'Campus update not found'
      });
    }

    res.json({
      success: true,
      message: 'Campus update deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete campus update'
    });
  }
};
