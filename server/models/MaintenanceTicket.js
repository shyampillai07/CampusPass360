const mongoose = require('mongoose');

const maintenanceTicketSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    usn: { type: String, required: true, uppercase: true, trim: true },
    description: { type: String, required: true, trim: true },
    status: { type: String, enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'], default: 'OPEN' },
    resolvedByStaffId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    resolutionNote: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MaintenanceTicket', maintenanceTicketSchema);