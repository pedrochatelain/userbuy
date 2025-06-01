const ROLES = require('../config/roles');
const { verifyToken } = require('../utils/auth.utils');

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Assuming token is in 'Bearer <token>' format

  if (!token) {
    return res.status(401).json({ error: 'Access token is missing' });
  }

  try {
    const decoded = await verifyToken(token)
    if (decoded.role !== ROLES.ADMIN) {
      return res.status(403).json({ error: 'Forbidden: You do not have permission to perform this action' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
