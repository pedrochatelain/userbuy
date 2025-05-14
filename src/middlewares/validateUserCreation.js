const { body, validationResult } = require('express-validator');
const ROLES = require('../config/roles');

// List of allowed fields for user creation
const allowedUserFields = ['username', 'password', 'role'];

const userValidation = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
  body('role')
    .optional() // Optional field
    .isString().withMessage('Role must be a string')
    .custom(value => Object.values(ROLES).includes(value.toUpperCase()))
    .withMessage(`Role must be one of the following: ${Object.values(ROLES).join(', ')}`),
];

async function validateUserCreation(req, res, next) {
  // Run validations
  await Promise.all(userValidation.map(validation => validation.run(req)));

  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Check for extra fields
  const extraFields = Object.keys(req.body).filter(key => !allowedUserFields.includes(key));
  if (extraFields.length > 0) {
    return res.status(400).json({ error: `Unexpected fields: ${extraFields.join(', ')}` });
  }

  next();
}

module.exports = validateUserCreation;
