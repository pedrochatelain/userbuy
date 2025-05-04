const { getProductsCollection } = require('../datasources/mongoDatasource')
const { ObjectId } = require('mongodb');
const datasource = require('../datasources/mongoDatasource')
const { ProductsNotFound } = require('../errors/customErrors') 

async function addProduct(product) {
    try {
        await datasource.addProduct(product)
    } catch(err) {
        throw err
    }
}

async function getProducts(queryParams) {
    try {
        return await datasource.getProducts(queryParams)
    } catch (err) {
        throw err
    }
}

function deleteProduct(productId) {
    const productsCollection = getProductsCollection()
    return productsCollection.findOneAndDelete({ _id: ObjectId.createFromHexString(productId) });
}

async function updateProduct(idProduct, productUpdate) {
    try {
        const updatedProduct = await datasource.updateProduct(idProduct, productUpdate)
        if ( ! updatedProduct)
            throw new ProductsNotFound(idProduct)
        else
            return updatedProduct
    } catch (err) {
        throw err
    }
}

module.exports = { addProduct, getProducts, deleteProduct, updateProduct }