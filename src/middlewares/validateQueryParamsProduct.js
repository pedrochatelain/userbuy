const { query, validationResult } = require('express-validator');

// List of allowed query parameters
const allowedQueryParams = ['name', 'price', 'category', 'stock_quantity', 'currency', 'image'];

const queryValidation = [
  query('name').optional().isString().withMessage('Name must be a string'),
  query('price')
    .optional()
    .isNumeric().withMessage('Price must be a number')
    .custom((value) => value > 0).withMessage('Price must be a positive number'),
  query('category').optional().isString().withMessage('Category must be a string'),
  query('stock_quantity')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock quantity must be a positive integer'),
  query('currency').optional().isString().withMessage('Currency must be a string'),
  query('image').optional().isString().withMessage('Image must be a string'),
];

async function validateQueryParamsProduct(req, res, next) {
  // Run validations
  await Promise.all(queryValidation.map(validation => validation.run(req)));

  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Check for extra query parameters
  const extraQueryParams = Object.keys(req.query).filter(key => !allowedQueryParams.includes(key));
  if (extraQueryParams.length > 0) {
    return res.status(400).json({ error: `Unexpected query parameters: ${extraQueryParams.join(', ')}` });
  }

  next();
}

module.exports = validateQueryParamsProduct;
