const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { validateStaffCreation } = require('../utils/validators');

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 12);


async function createStaff(req, res) {
  const errors = validateStaffCreation(req.body);
  if (errors.length > 0) return res.status(400).json({ errors });

  const { role, staffId, name, email, phone, password } = req.body;

  const existing = await User.findOne({
    $or: [{ staffId: staffId.toUpperCase() }, { email: email.toLowerCase() }],
  }).lean();
  if (existing) return res.status(409).json({ error: 'A staff account with this Staff ID or email already exists' });

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  let user;
  try {
    user = await User.create({ role, staffId, name, email, phone, passwordHash });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'A staff account with this Staff ID or email already exists' });
    throw err;
  }

  return res.status(201).json({ user: { id: user._id, role: user.role, staffId: user.staffId, name: user.name, email: user.email } });
}


async function listStaff(req, res) {
  const staff = await User.find({ role: { $in: ['WARDEN', 'GATE_STAFF'] } })
    .select('role staffId name email phone createdAt')
    .sort({ createdAt: -1 })
    .lean();
  return res.status(200).json({ staff });
}

module.exports = { createStaff, listStaff };