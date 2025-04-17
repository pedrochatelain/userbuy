const service = require('../services/purchaseService');

const addPurchase = async (req, res) => {
    const purchase = req.body;
    try {
        await service.addPurchase(purchase)
        res.status(201).json({"message": "added purchase", purchase})
    } catch (err) {
        res.status(err.statusCode).json({"error": err.message})
    }
}

const getPurchases = async (req, res) => {
    try {
        res.status(200).json(await service.getPurchases())
    } catch(err) {
        res.status(500).json({message: "Error fetching purchases"})
    }
}

const getPurchasesUser = async (req, res) => {
    const userId = req.params.userId
    try {
        res.status(200).json(await service.getPurchasesUser(userId))
    } catch(err) {
        console.log(err)
        res.status(500).json({message: "Error fetching user purchases"})
    }
}

module.exports = { addPurchase, getPurchases, getPurchasesUser };
