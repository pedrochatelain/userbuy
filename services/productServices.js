const { getProductsCollection } = require('../datasources/mongo')
const { ObjectId } = require('mongodb');

async function addProduct(product) {
    const products = getProductsCollection()
    products.insertOne(product)
}

async function getProducts(queryParams) {
    const query = {};
    for (const key in queryParams) {
        if (queryParams[key]) {
            query[key] = isNaN(queryParams[key]) ? queryParams[key] : parseFloat(queryParams[key]);
        }
    }
    // If query is empty, find({}) fetches all documents
    return getProductsCollection().find(query).toArray();
}

async function deleteProduct(productId) {
    const productsCollection = getProductsCollection()
    return productsCollection.deleteOne({ _id: ObjectId.createFromHexString(productId) });
}

module.exports = { addProduct, getProducts, deleteProduct }