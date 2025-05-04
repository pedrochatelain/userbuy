const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController')
const authorizeUser = require('../middlewares/authorizeUser')

// POST /api/purchases
router.post('/api/purchases', purchaseController.addPurchase);

// GET /api/purchases
router.get('/api/purchases', purchaseController.getPurchases)

// Get user's purchases
router.get('/api/users/:userId/purchases', authorizeUser, purchaseController.getPurchasesUser);

module.exports = router;