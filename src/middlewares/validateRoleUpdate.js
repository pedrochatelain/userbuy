const { body } = require('express-validator');
const ROLES = require('../config/roles');
const validRoles = Object.values(ROLES);

const validateRoleUpdate = [
  // Ensure only the "role" field is present in the request body
  body()
    .custom((value, { req }) => {
      const allowedKeys = ['role'];
      const keys = Object.keys(req.body);
      if (keys.length > 1 || (keys.length === 1 && !allowedKeys.includes(keys[0]))) {
        throw new Error('Only the "role" field is allowed in the request body');
      }
      return true;
    }),

  // Validate and sanitize the "role" field
  body('role')
    .exists().withMessage('role field is required') // Ensure the "role" field is present
    .bail() // Stop further validation if "role" is missing
    .customSanitizer(value => value ? value.trim().toUpperCase() : value) // Safely sanitize if "role" exists
    .isIn(validRoles).withMessage(`role must be one of the following: ${validRoles.join(', ')}`),
];

module.exports = validateRoleUpdate;
