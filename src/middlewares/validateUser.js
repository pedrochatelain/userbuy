const { body } = require('express-validator');
const ROLES = require('../config/roles');
const validRoles = Object.values(ROLES);

const validateUser = [
  // Validate username (mandatory)
  body('username')
    .notEmpty().withMessage('username is required'),
  
  // Validate password (mandatory)
  body('password')
    .notEmpty().withMessage('password is required'),
  
  // Validate role (optional)
  body('role')
    .optional() // Make the role field optional
    .customSanitizer(value => value ? value.toUpperCase() : value) // Convert to uppercase if provided
    .isIn(validRoles).withMessage(`role must be one of the following: ${validRoles.join(', ')}`),
  
  // Validate balances (optional and must be an object)
  body('balances')
    .optional() // Make balances optional
];

module.exports = validateUser;
