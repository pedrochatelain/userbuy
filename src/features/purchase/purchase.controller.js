const service = require('./purchase.service');

const addPurchase = async (req, res) => {
    try {
        const result = await service.addPurchase(req.body)
        res.status(201).json({"message": "added purchase", "purchase": result})
    } catch (err) {
        if ( ! err.statusCode)
            err.statusCode = 500
        res.status(err.statusCode).json({"error": err.message})
    }
}

const getPurchases = async (req, res) => {
    try {
        res.status(200).json(await service.getPurchases())
    } catch(err) {
        res.status(500).json({error: "Error fetching purchases"})
    }
}

const getPurchasesUser = async (req, res) => {
    const userId = req.params.userId
    try {
        res.status(200).json(await service.getPurchasesUser(userId))
    } catch(err) {
        console.log(err)
        res.status(500).json({error: "Error fetching user purchases"})
    }
}

const deletePurchase = async (req, res) => {
    try {
        const idPurchase = req.params.idPurchase
        const deletedPurchase = await service.deletePurchase(idPurchase)
        res.status(200).json({deletedPurchase: deletedPurchase})
    } catch (err) {
        if ( ! err.statusCode)
            err.statusCode = 500
        res.status(err.statusCode).json({error: err.message})
    }
}

module.exports = { addPurchase, getPurchases, getPurchasesUser, deletePurchase };
