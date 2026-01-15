const express = require('express');
const {
  createCampusUpdate,
  getCampusUpdates,
  updateCampusUpdate,
  deleteCampusUpdate
} = require('../controllers/campusUpdate.controller');

const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Public
router.get('/', getCampusUpdates);

// Admin
router.post('/', protect, createCampusUpdate);
router.put('/:id', protect, updateCampusUpdate);
router.delete('/:id', protect, deleteCampusUpdate);

module.exports = router;
