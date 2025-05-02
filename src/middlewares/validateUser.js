const { body, validationResult } = require('express-validator');

const validateUser = [
  // Validate username (mandatory)
  body('username')
    .notEmpty().withMessage('username is required'),

  // Validate password (mandatory)
  body('password')
    .notEmpty().withMessage('password is required'),

  // Middleware to check for extra fields
  (req, res, next) => {
    const allowedFields = ['username', 'password'];
    const extraFields = Object.keys(req.body).filter(field => !allowedFields.includes(field));

    if (extraFields.length > 0) {
      return res.status(400).json({
        error: `Invalid fields: ${extraFields.join(', ')}`,
      });
    }
    next();
  }
];

module.exports = validateUser;
