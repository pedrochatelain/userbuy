const datasource = require('./product.datasource')
const { ProductsNotFound } = require('../../errors/customErrors') 

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

async function deleteProduct(idProduct) {
    try {
        const product = await datasource.getProductById(idProduct)
        if ( ! product)
            throw new ProductsNotFound(idProduct)
        const deletedProduct = await datasource.deleteProduct(idProduct)
        if ( ! deletedProduct) 
            throw new ProductsNotFound(idProduct)
        return deletedProduct
    } catch (err) {
        throw err
    }
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