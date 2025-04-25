const { validationResult } = require('express-validator');

// Middleware to handle validation errors
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => {
      switch (err.msg) {
        case 'Only the "role" field is allowed in the request body':
          return 'The request can only include the `role` field.';
        case 'role field is required':
          return 'Please provide the `role` field in the request body.';
        default:
          return err.msg; // Use the default message for unhandled cases
      }
    });

    return res.status(400).json({
      success: false,
      errors: formattedErrors,
    });
  }

  next();
}

module.exports = handleValidationErrors;
