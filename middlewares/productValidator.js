const { body } = require('express-validator');

const validateProduct = [
  body('name').notEmpty().withMessage('Name is required'),
  body('price')
    .notEmpty().withMessage('Price is required')
    .isNumeric().withMessage('Price must be a number'),
  body('category').notEmpty().withMessage('Category is required'),
];

module.exports = validateProduct;
