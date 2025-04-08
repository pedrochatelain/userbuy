const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController')

// POST /api/purchases
router.post('/api/purchases', purchaseController.addPurchase);

module.exports = router;