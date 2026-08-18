const mongoose = require('mongoose');

const passSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    usn: { type: String, required: true, uppercase: true, trim: true },
    academicYear: { type: String, required: true },
    validFrom: { type: Date, required: true },
    validUntil: { type: Date, required: true },
    status: { type: String, enum: ['ACTIVE', 'SUSPENDED', 'REVOKED', 'EXPIRED'], default: 'ACTIVE' },
    tokenVersion: { type: Number, default: 1 },
  },
  { timestamps: true }
);

passSchema.index({ studentId: 1, academicYear: 1 }, { unique: true });

module.exports = mongoose.model('Pass', passSchema);