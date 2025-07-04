const datasourceUser = require('../user/user.datasource')
const datasourceProduct = require('../product/product.datasource')
const datasourcePurchase = require('./purchase.datasource')
const { UserNotFound, ProductsNotFound, InsufficientFunds, ProductDeletedError } = require('../../errors/customErrors')

async function addPurchase(purchase) {
    try {
        await validatePurchase(purchase)
        const product = await datasourceProduct.getProductById(purchase.idProduct)
        if (product.deleted)
            throw new ProductDeletedError()
        return await datasourcePurchase.purchase(purchase.idUser, product)
    } catch (err) {
        throw err
    }
}

async function validatePurchase(purchase) {
    // Check if the user exists in the database
    const user = await datasourceUser.getUser(purchase.idUser)
    if (! user) {
        throw new UserNotFound()
    }
    // Check if product exist in the database
    const product = await datasourceProduct.getProductById(purchase.idProduct)
    if ( ! product) {
        throw new ProductsNotFound(purchase.idProduct)
    } 
    // Check if user has sufficient funds to purchase the product
    if ( ! user.balances || user.balances < product.price ) {
        throw new InsufficientFunds()
    }
}

async function getPurchases() {
    return datasourcePurchase.getPurchases()
}

async function getPurchasesUser(idUser) {
    return datasourcePurchase.getPurchasesUser(idUser)
}

async function deletePurchase(idPurchase) {
    try {
        const deletedPurchase = await datasourcePurchase.deletePurchase(idPurchase)
        if ( ! deletedPurchase) {
            const error = new Error("Purchase not found")
            error.statusCode = 404
            throw error
        }
        return deletedPurchase
    } catch (err) {
        throw err
    }
}

async function getPurchase(idPurchase) {
    try {
        return await datasourcePurchase.getPurchase(idPurchase)
    } catch (err) {
        return null
    }
}

module.exports = { addPurchase, getPurchases, getPurchasesUser, deletePurchase, getPurchase }