const PaymentLedger = require('../models/PaymentLedger');
const HostelRoom = require('../models/HostelRoom');
require('../models/HostelBlock');
const MaintenanceTicket = require('../models/MaintenanceTicket');


async function getMyStatus(req, res) {
  const studentId = req.user.id;

  const ledger = await PaymentLedger.findOne({ studentId }).sort({ createdAt: -1 }).lean();

  const room = await HostelRoom.findOne({ 'beds.assignedStudentId': studentId })
    .populate('blockId', 'blockName category')
    .lean();


  let roomInfo = null;
  if (room) {
    const bed = room.beds.find((b) => String(b.assignedStudentId) === String(studentId));
    roomInfo = { block: room.blockId.blockName, room: room.roomNumber, bed: bed.bedNumber };
  }

  const openTickets = await MaintenanceTicket.countDocuments({
    studentId,
    status: { $in: ['OPEN', 'IN_PROGRESS'] },
  });


  return res.status(200).json({
    payment: ledger
      ? { isFullyPaid: ledger.isFullyPaid, vtuRentStatus: ledger.vtuRentStatus, messDdStatus: ledger.messDdStatus }
      : null,
    room: roomInfo,
    openMaintenanceTickets: openTickets,
  });
}

module.exports = { getMyStatus };