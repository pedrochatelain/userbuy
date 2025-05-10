const express = require('express');
const router = express.Router();
const validateProductCreation = require('../../middlewares/validateProductCreation');
const authorizeAdmin = require('../../middlewares/authorizeAdmin')
const productController = require('../product/product.controller')

// POST /api/products
router.post('/api/products', validateProductCreation, productController.addProduct);

// Update product
router.put('/api/products/:idProduct', authorizeAdmin, validateProductCreation, productController.updateProduct);

// GET /api/products
router.get('/api/products', productController.getProducts);

// DELETE /api/products
router.delete('/api/products/:id', authorizeAdmin, productController.deleteProduct);

module.exports = router;
