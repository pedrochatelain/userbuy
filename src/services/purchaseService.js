const { getPurchasesCollection, existsProducts, canAffordProducts, getUser } = require('../datasources/mongoDatasource')
const datasource = require('../datasources/mongoDatasource')
const { ObjectId } = require('mongodb');
const { UserNotFound, ProductsNotFound, InsufficientFunds } = require('../errors/customErrors')

async function addPurchase(purchase) {
    const purchasesCollection = getPurchasesCollection()
    const userID = purchase.userID
    const productsID = purchase.productsID
    // Check if the user exists in the database
    const user = await getUser(userID)
    if (! user) {
        throw new UserNotFound()
    }
    // Check if all products exist in the database
    const checkProducts = await checkProductsExistence(productsID)
    if ( ! checkProducts.allExist) {
        throw new ProductsNotFound(checkProducts.missingIds)
    } 
    // Check if user has sufficient funds to purchase the products
    const products = checkProducts.existingProducts
    if ( ! canAffordProducts(user, products) ) {
        throw new InsufficientFunds()
    }
    // purchase.total = 
    return purchasesCollection.insertOne(purchase)
}

async function checkProductsExistence(productsIds) {
    // Deduplicate the IDs and convert them to ObjectId instances
    const uniqueObjectIds = [...new Set(productsIds)].map(id => new ObjectId(id));
    // Query the collection to find the matching products
    const existingProducts = await datasource.getProductsByIds(uniqueObjectIds);
    // Get the IDs of the existing products as strings
    const existingIds = existingProducts.map(product => product._id.toString());
    // Identify the missing IDs
    const missingIds = uniqueObjectIds
        .filter(id => !existingIds.includes(id.toString()))
        .map(id => id.toString());
    return {
        allExist: missingIds.length === 0,
        missingIds,
        existingProducts
    };
}

async function getPurchases() {
    const datasource = require('../datasources/mongoDatasource')
    return datasource.getPurchases()
}

async function getPurchasesUser(userId) {
    const datasource = require('../datasources/mongoDatasource')
    return datasource.getPurchasesUser(userId)
}

module.exports = { addPurchase, getPurchases, getPurchasesUser }