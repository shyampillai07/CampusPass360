const mongoose = require('mongoose');

const ROLES = ['STUDENT', 'WARDEN', 'GATE_STAFF','ADMIN'];
const CATEGORIES = ['UG', 'PG'];

const userSchema = new mongoose.Schema(
    {
        role: {
            type: String,
            enum: ROLES,
            required: true,
            default: 'STUDENT',
        },

        
        usn: {
            type: String,
            trim: true,
            uppercase: true,
            sparse: true,
            unique: true,
        },

        
        staffId: {
            type: String,
            trim: true,
            uppercase: true,
            sparse: true,
            unique: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        
        passwordHash: {
            type: String,
            required: true,
            select: false,
        },

        phone: {
            type: String,
            required: true,
        },

       
        branch: { type: String, trim: true },
        category: { type: String, enum: CATEGORIES },
        gender: { type: String, trim: true },
        photoUrl: { type: String },
    },
    { timestamps: true } 
);


userSchema.pre('validate', function () {
  if (this.role === 'STUDENT' && !this.usn) {
    throw new Error('usn is required for STUDENT accounts');
  }
  if (this.role !== 'STUDENT' && !this.staffId) {
    throw new Error('staffId is required for WARDEN / GATE_STAFF accounts');
  }
});

module.exports = mongoose.model('User', userSchema);