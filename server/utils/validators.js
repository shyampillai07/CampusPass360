
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 64;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USN_REGEX = /^[A-Za-z0-9]{6,15}$/;
const PHONE_REGEX = /^[0-9]{10}$/;

function validatePassword(password) {
  if (typeof password !== 'string') return 'Password is required';
  const byteLength = Buffer.byteLength(password, 'utf8');
  if (byteLength < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }
  if (byteLength > MAX_PASSWORD_LENGTH) {
    return `Password must be at most ${MAX_PASSWORD_LENGTH} characters`;
  }
  return null; 
}

function validateEmail(email) {
  if (typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
    return 'A valid email is required';
  }
  return null;
}

function validateUsn(usn) {
  if (typeof usn !== 'string' || !USN_REGEX.test(usn)) {
    return 'A valid USN is required';
  }
  return null;
}

function validatePhone(phone) {
  if (typeof phone !== 'string' || !PHONE_REGEX.test(phone)) {
    return 'A valid 10-digit phone number is required';
  }
  return null;
}


function validateStudentRegistration(body) {
  const errors = [];
  const { usn, name, email, password, phone, branch, category, gender } = body || {};

  const usnErr = validateUsn(usn);
  if (usnErr) errors.push(usnErr);

  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.push('Name is required');
  }

  const emailErr = validateEmail(email);
  if (emailErr) errors.push(emailErr);

  const passwordErr = validatePassword(password);
  if (passwordErr) errors.push(passwordErr);

  const phoneErr = validatePhone(phone);
  if (phoneErr) errors.push(phoneErr);

  if (!branch || typeof branch !== 'string' || !branch.trim()) {
    errors.push('Branch is required');
  }

  if (!['UG', 'PG'].includes(category)) {
    errors.push('Category must be UG or PG');
  }

  if (!gender || typeof gender !== 'string' || !gender.trim()) {
    errors.push('Gender is required');
  }

  return errors;
}


function validateLogin(body) {
  const errors = [];
  const { identifier, password } = body || {};

  if (!identifier || typeof identifier !== 'string' || !identifier.trim()) {
    errors.push('USN/staff ID or email is required');
  }
  if (!password || typeof password !== 'string') {
    errors.push('Password is required');
  }

  return errors;
}


function validateProfileUpdate(body) {
  const errors = [];
  const { name, phone, branch, gender } = body || {};

  if (name !== undefined) {
    if (typeof name !== 'string' || !name.trim()) {
      errors.push('Name cannot be empty');
    }
  }

  if (phone !== undefined) {
    const phoneErr = validatePhone(phone);
    if (phoneErr) errors.push(phoneErr);
  }

  if (branch !== undefined) {
    if (typeof branch !== 'string' || !branch.trim()) {
      errors.push('Branch cannot be empty');
    }
  }

  if (gender !== undefined) {
    if (typeof gender !== 'string' || !gender.trim()) {
      errors.push('Gender cannot be empty');
    }
  }

  return errors;
}


function validateLedgerSubmission(body) {
  const errors = [];
  const { academicYear, vtuDuReference, vtuRentAmount, ddNumber, ddBankName, messFeeAmount } = body || {};

  const yearFormatOk = typeof academicYear === 'string' && /^\d{4}-\d{4}$/.test(academicYear);
  if (!yearFormatOk) {
    errors.push('Academic year must be in the format YYYY-YYYY, e.g. 2025-2026');
  } else {
    const [start, end] = academicYear.split('-').map(Number);
    if (end !== start + 1) {
      errors.push('Academic year end must be exactly one year after the start');
    }
  }

  if (!vtuDuReference || typeof vtuDuReference !== 'string' || !vtuDuReference.trim()) {
    errors.push('VTU/DU payment reference is required');
  }

  const rentAmount = Number(vtuRentAmount);
  if (!Number.isFinite(rentAmount) || rentAmount <= 0) {
    errors.push('VTU rent amount must be a positive number');
  }

  if (!ddNumber || typeof ddNumber !== 'string' || !ddNumber.trim()) {
    errors.push('DD number is required');
  }

  if (!ddBankName || typeof ddBankName !== 'string' || !ddBankName.trim()) {
    errors.push('DD bank name is required');
  }

  const messAmount = Number(messFeeAmount);
  if (!Number.isFinite(messAmount) || messAmount <= 0) {
    errors.push('Mess fee amount must be a positive number');
  }

  return errors;
}

function validateLedgerVerification(body) {
  const errors = [];
  const { stream, status } = body || {};
  if (!['vtuRent', 'messDd'].includes(stream)) errors.push('stream must be vtuRent or messDd');
  if (!['VERIFIED', 'REJECTED'].includes(status)) errors.push('status must be VERIFIED or REJECTED');
  return errors;
}

function validateMaintenanceTicket(body) {
  const errors = [];
  const { description } = body || {};
  if (!description || typeof description !== 'string' || description.trim().length < 10) {
    errors.push('Description must be at least 10 characters');
  }
  return errors;
}

function validateStaffCreation(body) {
  const errors = [];
  const { role, staffId, name, email, phone, password } = body || {};

  if (!['WARDEN', 'GATE_STAFF'].includes(role)) errors.push('Role must be WARDEN or GATE_STAFF');
  if (!staffId || typeof staffId !== 'string' || !staffId.trim()) errors.push('Staff ID is required');
  if (!name || typeof name !== 'string' || !name.trim()) errors.push('Name is required');

  const emailErr = validateEmail(email);
  if (emailErr) errors.push(emailErr);
  const phoneErr = validatePhone(phone);
  if (phoneErr) errors.push(phoneErr);
  const passwordErr = validatePassword(password);
  if (passwordErr) errors.push(passwordErr);

  return errors;
}

module.exports = {
  validatePassword,
  validateEmail,
  validateUsn,
  validatePhone,
  validateStudentRegistration,
  validateLogin,
  validateProfileUpdate, 
  validateLedgerSubmission, 
  validateLedgerVerification,
  validateMaintenanceTicket,
  validateStaffCreation, 
};