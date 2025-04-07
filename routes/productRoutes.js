const express = require('express');
const router = express.Router();
const validateProduct = require('../middlewares/productValidator');
const { validateObjectId } = require('../middlewares/objectIdValidator')
const productController = require('../controllers/productController')

// POST /api/products
router.post('/api/products', validateProduct, productController.addProduct);

// GET /api/products
router.get('/api/products', productController.getProducts);

// DELETE /api/products
router.delete('/api/products/:id', validateObjectId, productController.deleteProduct);

module.exports = router;
