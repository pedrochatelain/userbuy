const { getProductsCollection } = require('../datasources/mongo')

async function addProduct(product) {
    const products = getProductsCollection()
    products.insertOne(product)
}

module.exports = { addProduct }