const { GoogleGenAI } = require('@google/genai');
const getPromptFromSecretFile = require('../../config/getPromptFromSecretFile')

const datasource = require('./product.datasource')
const { ProductsNotFound, ProductRejectedByAI } = require('../../errors/customErrors'); 
const isProduction = require('../../config/isProduction');

async function checkProductWithGoogleAI(product) {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = await getPromptFromSecretFile();
    const formattedPrompt = prompt
        .replace('${product.category}', product.category)
        .replace('${product.name}', product.name);


    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: formattedPrompt,
    });

    const responseText = response.text.trim();

    // Sanitize the response by removing backticks and surrounding code blocks
    const sanitizedResponseText = responseText.replace(/```json|```/g, "").trim();

    let responseJson;
    try {
        responseJson = JSON.parse(sanitizedResponseText);
    } catch (parseErr) {
        throw new Error("Failed to parse AI response as JSON: " + sanitizedResponseText);
    }

    if (responseJson && responseJson.issues && (responseJson.issues.category || responseJson.issues.name)) {
        throw new ProductRejectedByAI(responseJson.issues)
    }
}



async function addProduct(product) {
    try {
        if (isProduction())
            await checkProductWithGoogleAI(product)
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