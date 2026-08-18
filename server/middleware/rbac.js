

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      
      return res.status(500).json({ error: 'requireRole used without requireAuth' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions for this operation' });
    }

    next();
  };
}

module.exports = { requireRole };