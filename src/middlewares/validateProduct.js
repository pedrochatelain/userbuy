const { body, validationResult } = require('express-validator');

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
];

async function validateProduct (req, res, next) {
  await Promise.all(productValidation.map(validation => validation.run(req)));

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

module.exports = validateProduct
