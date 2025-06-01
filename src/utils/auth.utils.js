const jwt = require('jsonwebtoken');
const loginService = require('../features/login/login.service');
const { TokenAlreadyBlacklisted } = require('../errors/customErrors');

async function verifyToken(token) {
  if (!token) {
    throw new Error('Access token is missing');
  }
  if (await loginService.isBlacklisted(token)) {
    throw new TokenAlreadyBlacklisted()
  }
  return jwt.verify(token, process.env.JWT_SECRET); // Replace with your JWT secret
}

function isAdmin(userRole) {
  const ROLES = require('../config/roles');
  return userRole === ROLES.ADMIN;
}

module.exports = { verifyToken, isAdmin };
