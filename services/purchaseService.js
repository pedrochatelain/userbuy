const { getPurchasesCollection, existsUser, existsProducts } = require('../datasources/mongo')

async function addPurchase(purchase) {
    const purchasesCollection = getPurchasesCollection()
    const userID = purchase.userID
    const productsID = purchase.productsID
    // Check if the user exists in the database
    if (! await existsUser(userID)) {
        return {
            hasErrors: true,
            statusCode: 404,
            message: "User doesn't exist"
        }
    }
    // Check if the products exist in the database
    const checkProducts = await existsProducts(productsID) 
    if ( ! checkProducts.allExist ) {
        return {
            hasErrors: true,
            statusCode: 404,
            message: `These products ID were not found: ${checkProducts.missingIds}`,
        }
    }
    return purchasesCollection.insertOne(purchase)
}

module.exports = { addPurchase }