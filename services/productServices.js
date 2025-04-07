const { getProductsCollection } = require('../datasources/mongo')

async function addProduct(product) {
    const products = getProductsCollection()
    products.insertOne(product)
}

async function getProducts() {
    return getProductsCollection().find().toArray();
}

module.exports = { addProduct, getProducts }