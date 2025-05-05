const express = require('express');
const router = express.Router();
const validateProduct = require('../../middlewares/validateProduct');
const authorizeAdmin = require('../../middlewares/authorizeAdmin')
const productController = require('../product/product.controller')

// POST /api/products
router.post('/api/products', validateProduct, productController.addProduct);

// Update product
router.put('/api/products/:idProduct', authorizeAdmin, validateProduct, productController.updateProduct);

// GET /api/products
router.get('/api/products', productController.getProducts);

// DELETE /api/products
router.delete('/api/products/:id', authorizeAdmin, productController.deleteProduct);

module.exports = router;
