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

const getPurchases = async (req, res) => {
    try {
        res.status(200).json(await service.getPurchases())
    } catch(err) {
        res.status(500).json({message: "Error fetching purchases"})
    }
}

module.exports = { addPurchase, getPurchases };
