const jwt = require('jsonwebtoken');
const User = require('../models/User');


async function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');


  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header' });
  }

  let payload;
  try {
    
    payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  
  const user = await User.findById(payload.sub);
  if (!user) {
    return res.status(401).json({ error: 'Account no longer exists' });
  }

  
  req.user = {
    id: user._id.toString(),
    role: user.role,
    usn: user.usn,
    staffId: user.staffId,
    name: user.name,
    email: user.email,
  };

  next(); 
}

module.exports = { requireAuth };