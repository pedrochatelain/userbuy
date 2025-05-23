const jwt = require('jsonwebtoken');
const ROLES = require('../config/roles')

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Assuming token is in 'Bearer <token>' format

  if (!token) {
    return res.status(401).json({ error: 'Access token is missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your JWT secret
    if (decoded.role !== ROLES.ADMIN) {
      return res.status(403).json({ error: 'Forbidden: You do not have permission to perform this action' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
