const express = require('express');
const router = express.Router();
const validateProduct = require('../middlewares/productValidator');
const { validationResult } = require('express-validator');
const service = require('../services/productServices')

// POST /api/products
router.post('/api/products', validateProduct, (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const product = req.body;
  console.log('Received product:', product);
  service.addProduct(product)
  res.status(200).json({ message: 'Product added successfully', product });
});

// GET /api/products
router.get('/api/products', async (req, res) => {
  const products = await service.getProducts()
  console.log(products)
  res.json(products)
});

module.exports = router;
