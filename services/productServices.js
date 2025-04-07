const { getProductsCollection } = require('../datasources/mongo')
const { ObjectId } = require('mongodb');

async function addProduct(product) {
    const products = getProductsCollection()
    products.insertOne(product)
}

async function getProducts() {
    return getProductsCollection().find().toArray();
}

async function deleteProduct(productId) {
    const productsCollection = getProductsCollection()
    return productsCollection.deleteOne({ _id: ObjectId.createFromHexString(productId) });
}

module.exports = { addProduct, getProducts, deleteProduct }