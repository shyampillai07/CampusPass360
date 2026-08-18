const mongoose = require('mongoose');

const hostelBlockSchema = new mongoose.Schema(
  {
    blockName: { type: String, required: true, unique: true, trim: true },
    category: { type: String, enum: ['UG', 'PG'], required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('HostelBlock', hostelBlockSchema);