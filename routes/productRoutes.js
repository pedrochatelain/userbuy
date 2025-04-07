const express = require('express');
const router = express.Router();
const validateProduct = require('../middlewares/productValidator');
const { validationResult } = require('express-validator');
const service = require('../services/productServices')
const { ObjectId } = require('mongodb');

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

// DELETE /api/products
router.delete('/api/products/:id', async (req, res) => {
  const productId = req.params.id;

  // Validate the ID format
  if (!ObjectId.isValid(productId)) {
    return res.status(400).send({ error: 'Invalid product ID format' });
  }

  try {
    // Delete the document with the matching _id
    const result = await service.deleteProduct(productId);

    if (result.deletedCount === 1) {
      res.status(200).send({ message: 'Product deleted successfully' });
    } else {
      res.status(404).send({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

module.exports = router;
