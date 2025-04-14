const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController')
const validateProductsIDs = require('../middlewares/validateIdProduct')
const authorizeUser = require('../middlewares/authorizeUser')

// POST /api/purchases
router.post('/api/purchases', validateProductsIDs, purchaseController.addPurchase);

// GET /api/purchases
router.get('/api/purchases', purchaseController.getPurchases)

// GET /api/purchases/:userId
router.get('/api/purchases/:userId', authorizeUser, purchaseController.getPurchasesUser);

module.exports = router;