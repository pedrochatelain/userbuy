const express = require('express');
const router = express.Router();
const validateProduct = require('../middlewares/productValidator');
const { validationResult } = require('express-validator');

// POST /api/products
router.post('/', validateProduct, (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const product = req.body;
  console.log('Received product:', product);
  res.status(200).json({ message: 'Product added successfully', product });
});

module.exports = router;
