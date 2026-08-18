const express = require('express');
const { createTicket, listMyTickets, listAllTickets, updateTicket } = require('../controllers/maintenanceController');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

const router = express.Router();

router.post('/tickets', requireAuth, requireRole('STUDENT'), createTicket);
router.get('/tickets/me', requireAuth, requireRole('STUDENT'), listMyTickets);
router.get('/tickets', requireAuth, requireRole('WARDEN'), listAllTickets);
router.patch('/tickets/:id', requireAuth, requireRole('WARDEN'), updateTicket);

module.exports = router;