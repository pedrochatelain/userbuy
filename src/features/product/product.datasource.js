const { getDb } = require('../../config/database.mongodb.js');
const { ObjectId } = require('mongodb');

function getProductsCollection() {
    return getDb().collection('products');
}

async function addProduct(product) {
  try {
    await getProductsCollection().insertOne(product)    
  } catch(err) {
    throw err
  }
}

async function updateProduct(idProduct, productUpdate) {
  try {
      // Perform the update and return the updated product
      return await getProductsCollection().findOneAndUpdate(
          { _id: new ObjectId(idProduct) }, // Filter by product ID
          { $set: productUpdate },         // Update with the provided fields
          { returnDocument: 'after' }      // Return the updated document
      );
  } catch (err) {
      console.error(`Failed to update product: ${err}`);
      throw err;
  }
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

async function deleteProduct(idProduct) {
  return await getProductsCollection().findOneAndDelete({ _id: ObjectId.createFromHexString(idProduct) });
}
  
async function getProductById(id) {
    try {
        if (!ObjectId.isValid(id)) {
        return null;
        }
        return await getProductsCollection().findOne({ _id: ObjectId.createFromHexString(id) });
    } catch (err) {
        return null
    }
}

module.exports = {
    addProduct,
    updateProduct,
    getProducts,
    deleteProduct,
    getProductById
}