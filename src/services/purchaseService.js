const datasource = require('../datasources/mongoDatasource')
const { ObjectId } = require('mongodb');
const { UserNotFound, ProductsNotFound, InsufficientFunds } = require('../errors/customErrors')

async function addPurchase(purchase) {
    // Check if the user exists in the database
    const user = await datasource.getUser(purchase.idUser)
    if (! user) {
        throw new UserNotFound()
    }
    // Check if product exist in the database
    const product = await datasource.getProductById(purchase.idProduct)
    if ( ! product) {
        throw new ProductsNotFound(purchase.idProduct)
    } 
    // Check if user has sufficient funds to purchase the product
    if ( user.balances < product.price ) {
        throw new InsufficientFunds()
    }
    return await datasource.purchase(purchase.idUser, product)
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