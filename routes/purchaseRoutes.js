const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController')
const validateProductsIDs = require('../middlewares/validateIdProduct')

// POST /api/purchases
router.post('/api/purchases', validateProductsIDs, purchaseController.addPurchase);

// GET /api/purchases
router.get('/api/purchases', purchaseController.getPurchases)

module.exports = router;