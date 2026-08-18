const mongoose = require('mongoose');

const VTU_RENT_STATUSES = ['PENDING', 'VERIFIED', 'REJECTED'];
const MESS_DD_STATUSES = ['PHYSICAL_DD_RECEIVED', 'VERIFIED', 'REJECTED'];

const paymentLedgerSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    
    usn: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    
    academicYear: {
      type: String,
      required: true,
      trim: true,
    },

   
    vtuDuReference: {
      type: String,
      required: true,
      unique: true, 
      trim: true,
    },
    vtuRentAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    vtuReceiptPdfUrl: {
      type: String, 
    },
    vtuRentStatus: {
      type: String,
      enum: VTU_RENT_STATUSES,
      default: 'PENDING',
    },

  
    ddNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    ddBankName: {
      type: String,
      required: true,
      trim: true,
    },
    messFeeAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    messDdStatus: {
      type: String,
      enum: MESS_DD_STATUSES,
      default: 'PHYSICAL_DD_RECEIVED', 
    },

    
    verifiedByStaffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    
    isFullyPaid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);


paymentLedgerSchema.index({ studentId: 1, academicYear: 1 }, { unique: true });


paymentLedgerSchema.pre('save', function () {
  this.isFullyPaid = this.vtuRentStatus === 'VERIFIED' && this.messDdStatus === 'VERIFIED';
});

module.exports = mongoose.model('PaymentLedger', paymentLedgerSchema);