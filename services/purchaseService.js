const { getPurchasesCollection, existsUser } = require('../datasources/mongo')

async function addPurchase(purchase) {
    console.log(purchase)
    const purchasesCollection = getPurchasesCollection()
    const userID = purchase.userID
    const productsIDs = purchase.productsIDs
    // Check if the user and products exist in the database
    const existsProducts = true
    if (! await existsUser(userID)) {
        return {
            hasErrors: true,
            statusCode: 404,
            message: "User doesn't exist"
        }
    }
    if (await existsUser(userID) && existsProducts) {
        return purchasesCollection.insertOne(purchase)
    }
    return null
}

module.exports = { addPurchase }