const jwt = require('jsonwebtoken');
const Pass = require('../models/Pass');
const User = require('../models/User');
const PaymentLedger = require('../models/PaymentLedger');
const HostelRoom = require('../models/HostelRoom');
require('../models/HostelBlock'); 


async function verifyPass(req, res) {
  const { qrToken } = req.body;
  if (!qrToken) return res.status(200).json({ accessGranted: false, reason: 'No QR code provided' });

  let payload;
  try {
    payload = jwt.verify(qrToken, process.env.QR_SIGNING_SECRET);
  } catch {
    return res.status(200).json({ accessGranted: false, reason: 'Invalid or expired QR code' });
  }

  const pass = await Pass.findById(payload.passId);
  if (!pass) return res.status(200).json({ accessGranted: false, reason: 'Pass not found' });
  if (pass.tokenVersion !== payload.tokenVersion) {
    return res.status(200).json({ accessGranted: false, reason: 'QR code has been superseded' });
  }
  if (pass.status !== 'ACTIVE') {
    return res.status(200).json({ accessGranted: false, reason: `Pass is ${pass.status}` });
  }

  const now = new Date();
  if (now < pass.validFrom || now > pass.validUntil) {
    return res.status(200).json({ accessGranted: false, reason: 'Pass is outside its valid date range' });
  }

  
  const ledger = await PaymentLedger.findOne({ studentId: pass.studentId, isFullyPaid: true });
  if (!ledger) return res.status(200).json({ accessGranted: false, reason: 'Payment no longer verified' });

  const room = await HostelRoom.findOne({ 'beds.assignedStudentId': pass.studentId }).populate('blockId', 'blockName');
  if (!room) return res.status(200).json({ accessGranted: false, reason: 'No active room allocation' });
  const bed = room.beds.find((b) => String(b.assignedStudentId) === String(pass.studentId));

  const student = await User.findById(pass.studentId).lean();

  
  return res.status(200).json({
    accessGranted: true,
    usn: pass.usn,
    name: student.name,
    photoUrl: student.photoUrl || null,
    room: `${room.blockId.blockName}, Room ${room.roomNumber} (Bed ${bed.bedNumber})`,
    passValidUntil: pass.validUntil,
  });
}

module.exports = { verifyPass };