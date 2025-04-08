const service = require('../services/purchaseService');

const addPurchase = async (req, res) => {
    const purchase = req.body;
    const addingPurchase = await service.addPurchase(purchase)
    if ( ! addingPurchase.hasErrors) {
        res.status(201).json({"message": "added purchase", purchase})
    } else {
        res.status(addingPurchase.statusCode).json({"error": addingPurchase.message})
    }
}

module.exports = { addPurchase };
