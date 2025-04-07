const express = require('express');
const router = express.Router();
const validateProduct = require('../middlewares/productValidator');
const { validateObjectId } = require('../middlewares/objectIdValidator')
const productController = require('../controllers/productController')
const service = require('../services/productServices')

// POST /api/products
router.post('/api/products', validateProduct, productController.addProduct);

// GET /api/products
router.get('/api/products', async (req, res) => {
  const products = await service.getProducts()
  console.log(products)
  res.json(products)
});

// DELETE /api/products
router.delete('/api/products/:id', validateObjectId, async (req, res) => {
  const productId = req.params.id;

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
