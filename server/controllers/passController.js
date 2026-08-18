const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Pass = require('../models/Pass');
const PaymentLedger = require('../models/PaymentLedger');
const HostelRoom = require('../models/HostelRoom');
require('../models/HostelBlock'); 

const QR_TOKEN_TTL_SECONDS = 45;


async function getMyPass(req, res) {
  const studentId = req.user.id;

  const ledger = await PaymentLedger.findOne({ studentId, isFullyPaid: true }).sort({ createdAt: -1 }).lean();
  const room = await HostelRoom.findOne({ 'beds.assignedStudentId': studentId }).populate('blockId', 'blockName category').lean();

  if (!ledger || !room) {
    return res.status(200).json({ pass: null, reason: 'Pass issues only after payment verification and room allocation are both complete.' });
  }

  let pass = await Pass.findOne({ studentId, academicYear: ledger.academicYear });
  if (!pass) {
    const now = new Date();
    const validUntil = new Date(now);
    validUntil.setFullYear(validUntil.getFullYear() + 1);
    pass = await Pass.create({ studentId, usn: req.user.usn, academicYear: ledger.academicYear, validFrom: now, validUntil });
  }

  const bed = room.beds.find((b) => String(b.assignedStudentId) === String(studentId));

  const qrToken = jwt.sign(
    { passId: pass._id.toString(), usn: pass.usn, tokenVersion: pass.tokenVersion, jti: crypto.randomUUID() },
    process.env.QR_SIGNING_SECRET,
    { expiresIn: QR_TOKEN_TTL_SECONDS }
  );

  return res.status(200).json({
    pass: {
      usn: pass.usn,
      status: pass.status,
      validFrom: pass.validFrom,
      validUntil: pass.validUntil,
      room: `${room.blockId.blockName}, Room ${room.roomNumber}`,
      bed: bed.bedNumber,
      qrToken,
      qrTtlSeconds: QR_TOKEN_TTL_SECONDS,
    },
  });
}

module.exports = { getMyPass };