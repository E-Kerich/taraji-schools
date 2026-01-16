const express = require('express');
const router = express.Router();

const {
  createCampusUpdate,
  getAdminCampusUpdates,
  getPublicCampusUpdates,
  updateCampusUpdate,
  deleteCampusUpdate
} = require('../controllers/campusUpdate.controller');

const { protect, admin } = require('../middleware/auth.middleware');

// ============================
// ADMIN ROUTES
// ============================
router.get('/', getAdminCampusUpdates);
router.post('/', createCampusUpdate);
router.put('/:id', updateCampusUpdate);
router.delete('/:id', deleteCampusUpdate);


// ============================
// PUBLIC ROUTES
// ============================
router.get('/public', getPublicCampusUpdates);

module.exports = router;
