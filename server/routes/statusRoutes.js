const express = require('express');
const { getMyStatus } = require('../controllers/statusController');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

const router = express.Router();
router.get('/me', requireAuth, requireRole('STUDENT'), getMyStatus);

module.exports = router;