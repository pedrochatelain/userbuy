const jwt = require('jsonwebtoken');

function verifyToken(req) {
  const token = req.headers.authorization?.split(' ')[1]; // Assuming token is in 'Bearer <token>' format
  if (!token) {
    throw new Error('Access token is missing');
  }

  return jwt.verify(token, process.env.JWT_SECRET); // Replace with your JWT secret
}

function isAdmin(userRole) {
  const ROLES = require('../config/roles');
  return userRole === ROLES.ADMIN;
}

module.exports = { verifyToken, isAdmin };
