const { body } = require('express-validator');
const ROLES = require('../config/roles')
const validRoles = Object.values(ROLES);

const validateUser = [
  // Validate username (mandatory)
  body('username')
    .notEmpty().withMessage('username is required'),
  
  // Validate password (mandatory)
  body('password')
    .notEmpty().withMessage('password is required'),
  
  // Validate role
  body('role')
    .notEmpty().withMessage('role field is required')
    .customSanitizer(value => value.toUpperCase())
    .isIn(validRoles).withMessage(`role must be one of the following: ${validRoles.join(', ')}`),
  
  // Validate balances (must be positive numbers)
  body('balances')
    .isObject().withMessage('balances must be an object'),
  
  body('balances.bank_account')
    .optional()
    .isNumeric().withMessage('bank_account must be a number')
    .custom((value) => value >= 0).withMessage('bank_account cannot be negative'),
  
  body('balances.credit_card')
    .optional()
    .isNumeric().withMessage('credit_card must be a number')
    .custom((value) => value >= 0).withMessage('credit_card cannot be negative'),
  
  body('balances.digital_wallet')
    .optional()
    .isNumeric().withMessage('digital_wallet must be a number')
    .custom((value) => value >= 0).withMessage('digital_wallet cannot be negative'),
];

module.exports = validateUser;
