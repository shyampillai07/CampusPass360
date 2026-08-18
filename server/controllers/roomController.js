const HostelRoom = require('../models/HostelRoom');
const User = require('../models/User');
const PaymentLedger = require('../models/PaymentLedger');

require('../models/HostelBlock'); 



async function listUnallocatedStudents(req, res) {
  const paidStudentIds = await PaymentLedger.distinct('studentId', { isFullyPaid: true });

  const roomsWithOccupants = await HostelRoom.find({ 'beds.assignedStudentId': { $ne: null } })
    .select('beds.assignedStudentId')
    .lean();
  const occupiedIds = new Set(
    roomsWithOccupants.flatMap((r) => r.beds.map((b) => b.assignedStudentId).filter(Boolean).map(String))
  );

  const unallocatedIds = paidStudentIds.filter((id) => !occupiedIds.has(String(id)));

  const students = await User.find({ _id: { $in: unallocatedIds }, role: 'STUDENT' })
    .select('name usn category branch')
    .lean();

  return res.status(200).json({ students });
}


async function listRooms(req, res) {
  const rooms = await HostelRoom.find().populate('blockId', 'blockName category').lean();
  return res.status(200).json({ rooms });
}



async function allocateBed(req, res) {
  const { studentId, roomId, bedId } = req.body;
  if (!studentId || !roomId || !bedId) {
    return res.status(400).json({ error: 'studentId, roomId, and bedId are required' });
  }

  const student = await User.findById(studentId);
  if (!student || student.role !== 'STUDENT') {
    return res.status(404).json({ error: 'Student not found' });
  }

  
  const paidLedger = await PaymentLedger.findOne({ studentId, isFullyPaid: true });
  if (!paidLedger) {
    return res.status(403).json({ error: 'Student does not have a verified payment on record' });
  }

  const room = await HostelRoom.findById(roomId).populate('blockId');
  if (!room) return res.status(404).json({ error: 'Room not found' });

  if (room.blockId.category !== student.category) {
    return res.status(400).json({ error: `${student.category} students cannot be allocated to a ${room.blockId.category} block` });
  }

 
  const updated = await HostelRoom.findOneAndUpdate(
    { _id: roomId, 'beds._id': bedId, 'beds.status': 'AVAILABLE' },
    {
      $set: {
        'beds.$.status': 'OCCUPIED',
        'beds.$.assignedStudentId': studentId,
        'beds.$.assignedAt': new Date(),
      },
      $inc: { occupiedBedsCount: 1 },
    },
    { new: true }
  );

  if (!updated) {
    return res.status(409).json({ error: 'Bed is no longer available' });
  }

  return res.status(200).json({ room: updated });
}

module.exports = { listRooms, allocateBed, listUnallocatedStudents };