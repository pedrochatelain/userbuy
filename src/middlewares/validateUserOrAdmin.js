const jwt = require('jsonwebtoken');
const ROLES = require('../config/roles');

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Assuming token is in 'Bearer <token>' format

  if (!token) {
    return res.status(401).json({ message: 'Access token is missing' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Replace with your JWT secret
    const userIdFromToken = decodedToken.id;
    const userRole = decodedToken.role;

    // Allow if user is accessing their own resource or is an admin
    if (userIdFromToken === req.params.idUser || userRole === ROLES.ADMIN) {
      return next();
    }

    return res.status(403).json({ error: 'Forbidden: You do not have permission to perform this action' });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
