const express = require('express');
const { listRooms , allocateBed, listUnallocatedStudents} = require('../controllers/roomController');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

const router = express.Router();
router.get('/', requireAuth, requireRole('WARDEN'), listRooms);
router.post('/allocate', requireAuth, requireRole('WARDEN'), allocateBed);
router.get('/unallocated', requireAuth, requireRole('WARDEN'), listUnallocatedStudents);

module.exports = router;