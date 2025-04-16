const { getPurchasesCollection, existsProducts, canAffordProducts, getUser } = require('../datasources/mongo')
const datasource = require('../datasources/mongo')

async function addPurchase(purchase) {
    const purchasesCollection = getPurchasesCollection()
    const userID = purchase.userID
    const productsID = purchase.productsID
    // Check if the user exists in the database
    const user = await getUser(userID)
    if (! user) {
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
    const products = checkProducts.existingProducts
    if ( ! canAffordProducts(user, products) ) {
        return {
            hasErrors: true,
            statusCode: 400,
            message: `Insufficient funds`,
        }
    }
    // purchase.total = 
    return purchasesCollection.insertOne(purchase)
}

async function checkAllProductsExist(productsIds) {
    // Deduplicate the IDs and convert them to ObjectId instances
    const uniqueObjectIds = [...new Set(productsIds)].map(id => new ObjectId(id));
    // Query the collection to find the matching products
    const existingProducts = datasource.getProductsByIds(uniqueObjectIds)
    // Get the IDs of the existing products as strings
    const existingIds = existingProducts.map(product => product._id.toString());
    // Identify the missing IDs
    const missingIds = uniqueObjectIds
    .filter(id => !existingIds.includes(id.toString()))
    .map(id => id.toString());
    if ( ! missingIds.length === 0) {
        throw Error(`These products ID were not found: ${missingIds}`)
    }
}

async function getPurchases() {
    const datasource = require('../datasources/mongo')
    return datasource.getPurchases()
}

async function getPurchasesUser(userId) {
    const datasource = require('../datasources/mongo')
    return datasource.getPurchasesUser(userId)
}

module.exports = { addPurchase, getPurchases, getPurchasesUser }