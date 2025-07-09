const express = require('express');
const router = express.Router();
const validateProductCreation = require('../../middlewares/validateProductCreation');
const authorizeAdmin = require('../../middlewares/authorizeAdmin')
const productController = require('../product/product.controller')
const validateQueryParamsProduct = require('../../middlewares/validateQueryParamsProduct')
const { uploadFile } = require('../../middlewares/uploadFile')

// POST /api/products
router.post('/api/products', authorizeAdmin, uploadFile('image'), productController.addProduct);

// Replace image of an existing product
router.patch('/api/products/:idProduct/image', uploadFile('image'), productController.addImageProduct);

// GET /api/products
router.get('/api/products', validateQueryParamsProduct, productController.getProducts);

// GET /api/products/:idProduct
router.get('/api/products/:idProduct', productController.getProduct);

// DELETE /api/products
router.delete('/api/products/:id', authorizeAdmin, productController.deleteProduct);

module.exports = router;
