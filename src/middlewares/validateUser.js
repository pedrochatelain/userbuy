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
    .isObject().withMessage('balances must be an object if provided'),
  
  // Validate balances.bank_account (optional and must be a positive number)
  body('balances.bank_account')
    .optional()
    .isNumeric().withMessage('bank_account must be a number')
    .custom((value) => value >= 0).withMessage('bank_account cannot be negative'),
  
  // Validate balances.credit_card (optional and must be a positive number)
  body('balances.credit_card')
    .optional()
    .isNumeric().withMessage('credit_card must be a number')
    .custom((value) => value >= 0).withMessage('credit_card cannot be negative'),
  
  // Validate balances.digital_wallet (optional and must be a positive number)
  body('balances.digital_wallet')
    .optional()
    .isNumeric().withMessage('digital_wallet must be a number')
    .custom((value) => value >= 0).withMessage('digital_wallet cannot be negative'),
];

module.exports = validateUser;
