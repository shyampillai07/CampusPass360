const express = require('express');
const { getMyPass } = require('../controllers/passController');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

const router = express.Router();
router.get('/me', requireAuth, requireRole('STUDENT'), getMyPass);

module.exports = router;