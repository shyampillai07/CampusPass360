const mongoose = require('mongoose');

const bedSchema = new mongoose.Schema({
  bedNumber: { type: String, required: true, trim: true },
  status: { type: String, enum: ['AVAILABLE', 'OCCUPIED', 'OUT_OF_SERVICE'], default: 'AVAILABLE' },
  assignedStudentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  assignedAt: { type: Date, default: null },
});

const hostelRoomSchema = new mongoose.Schema(
  {
    blockId: { type: mongoose.Schema.Types.ObjectId, ref: 'HostelBlock', required: true },
    roomNumber: { type: String, required: true, trim: true },
    totalCapacity: { type: Number, required: true, min: 1 },
    beds: [bedSchema],
   
    occupiedBedsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

hostelRoomSchema.index({ blockId: 1, roomNumber: 1 }, { unique: true });

hostelRoomSchema.pre('save', function () {
  this.occupiedBedsCount = this.beds.filter((b) => b.status === 'OCCUPIED').length;
});

module.exports = mongoose.model('HostelRoom', hostelRoomSchema);