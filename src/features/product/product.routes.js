const express = require('express');
const router = express.Router();
const validateProductCreation = require('../../middlewares/validateProductCreation');
const authorizeAdmin = require('../../middlewares/authorizeAdmin')
const productController = require('../product/product.controller')
const validateQueryParamsProduct = require('../../middlewares/validateQueryParamsProduct')
const { uploadFile } = require('../../middlewares/uploadFile')

// POST /api/products
router.post('/api/products', validateProductCreation, productController.addProduct);

// POST /api/products
router.post('/api/products/:idProduct/images', uploadFile('image'), productController.addImageProduct);

// Update product
router.put('/api/products/:idProduct', authorizeAdmin, validateProductCreation, productController.updateProduct);

// GET /api/products
router.get('/api/products', validateQueryParamsProduct, productController.getProducts);

// DELETE /api/products
router.delete('/api/products/:id', authorizeAdmin, productController.deleteProduct);

module.exports = router;
