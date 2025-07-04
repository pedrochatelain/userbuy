
const datasource = require('./product.datasource')
const { ProductsNotFound, ProductNotFound, MismatchProductNameAndImage } = require('../../errors/customErrors'); 
const isProduction = require('../../utils/isProduction');
const categorizeProductWithAI = require('../../utils/checkProductWithGoogleAI')
const uploadImageToCloudinary = require('../../utils/uploadImageToCloudinary');
const validateImageDescription = require('../../utils/validateImageDescription');

async function addImageProduct(idProduct, image) {
    try {
        const product = await datasource.getProductById(idProduct)
        if (product == null)
            throw new ProductNotFound(idProduct)
        const descriptionAndImage = await validateImageDescription(product.name, image)
        if (descriptionAndImage.match) {
            const uploadImage = await uploadImageToCloudinary(image.buffer)
            product.image = uploadImage.url
            datasource.updateProduct(idProduct, product)
            return {
                message: "Image added successfully",
                product
            }
        } else {
            throw new MismatchProductNameAndImage(descriptionAndImage)
        }
    } catch (err) {
        throw err
    }
    
}

async function addProduct(product) {
    try {
        if (isProduction()) {
            const response = await categorizeProductWithAI(product.name)
            product.category = response.category
            if (product.image) {
                const descriptionAndImage = await validateImageDescription(product.name, product.image)
                if ( ! descriptionAndImage.match) {    
                    throw new MismatchProductNameAndImage(descriptionAndImage)
                }
                const uploadImage = await uploadImageToCloudinary(product.image.buffer)
                product.image = uploadImage.url
            }
        }
        await datasource.addProduct(product)
        return product
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
        return await datasource.deleteProduct(idProduct)
    } catch (err) {
        throw err
    }
}

async function getProduct(idProduct) {
    try {
        return await datasource.getProductById(idProduct)
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

module.exports = { 
    addProduct,
    getProducts,
    deleteProduct,
    updateProduct,
    addImageProduct,
    getProduct
}