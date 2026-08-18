const express = require('express');
const { createStaff, listStaff } = require('../controllers/adminController');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

const router = express.Router();
router.post('/staff', requireAuth, requireRole('ADMIN'), createStaff);
router.get('/staff', requireAuth, requireRole('ADMIN'), listStaff);

module.exports = router;