const express = require('express');
const { verifyPass } = require('../controllers/scannerController');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

const router = express.Router();
router.post('/verify', requireAuth, requireRole('GATE_STAFF'), verifyPass);

module.exports = router;