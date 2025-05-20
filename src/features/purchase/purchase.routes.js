const express = require('express');
const router = express.Router();
const purchaseController = require('./purchase.controller')
const validateUserAccess = require('../../middlewares/validateUserAccess')
const validatePurchaseDeletion = require('../../middlewares/validatePurchaseDeletion')

// POST /api/purchases
router.post('/api/purchases', purchaseController.addPurchase);

// GET /api/purchases
router.get('/api/purchases', purchaseController.getPurchases)

// Get user's purchases
router.get('/api/users/:idUser/purchases', validateUserAccess, purchaseController.getPurchasesUser);

// Delete purchase
router.delete('/api/purchases/:idPurchase', validatePurchaseDeletion, purchaseController.deletePurchase);

module.exports = router;