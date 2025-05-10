const { body, validationResult } = require('express-validator');

// List of allowed fields
const allowedFields = ['name', 'price', 'category', 'stock_quantity', 'currency', 'image'];

const productValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('price')
    .notEmpty().withMessage('Price is required')
    .isNumeric().withMessage('Price must be a number')
    .custom((value) => value > 0).withMessage('Price must be a positive number'),
  body('category').notEmpty().withMessage('Category is required'),
  body('stock_quantity')
    .notEmpty().withMessage('Stock quantity is required')
    .isInt({ min: 0 }).withMessage('Stock quantity must be a positive integer'),
  body('currency')
    .optional() // Optional field
    .isString().withMessage('Currency must be a string'),
  body('image')
    .optional() // Optional field
    .isString().withMessage('Image must be a string'),
];

async function validateProductCreation(req, res, next) {
  // Run validations
  await Promise.all(productValidation.map(validation => validation.run(req)));

  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Check for extra fields
  const extraFields = Object.keys(req.body).filter(key => !allowedFields.includes(key));
  if (extraFields.length > 0) {
    return res.status(400).json({ error: `Unexpected fields: ${extraFields.join(', ')}` });
  }

  next();
}

module.exports = validateProductCreation;
