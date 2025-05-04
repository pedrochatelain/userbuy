const { getDb } = require('./mongoConnection');
const { ObjectId } = require('mongodb');
const { UserNotFound } = require('../errors/customErrors')

function getProductsCollection() {
  return getDb().collection('products');
}

function getUsersCollection() {
  return getDb().collection('users');
}

function getPurchasesCollection() {
  return getDb().collection('purchases');
}

async function addProduct(product) {
  try {
    await getProductsCollection().insertOne(product)    
  } catch(err) {
    throw err
  }
}

async function getUser(userID) {
  const usersCollection = getUsersCollection();

  // Check if userID is valid before attempting to create an ObjectId
  if (!ObjectId.isValid(userID)) {
    return null; // Return null or handle invalid ID cases appropriately
  }

  const documentID = ObjectId.createFromHexString(userID);

  try {
    return await usersCollection.findOne({ _id: documentID });
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

async function getUserByUsername(username) {
  const usersCollection = getUsersCollection();
  try {
    return await usersCollection.findOne({ username: username });
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

async function existsUser(userID) {
  const exists = await getUser(userID) != null
  return exists
}

async function existsProducts(productsIDs) {
  // Deduplicate the IDs and convert them to ObjectId instances
  const uniqueObjectIds = [...new Set(productsIDs)].map(id => new ObjectId(id));

  // Query the collection to find the matching products
  const existingProducts = await getProductsCollection().find({ _id: { $in: uniqueObjectIds } }).toArray();

  // Get the IDs of the existing products as strings
  const existingIds = existingProducts.map(product => product._id.toString());

  // Identify the missing IDs
  const missingIds = uniqueObjectIds
    .filter(id => !existingIds.includes(id.toString()))
    .map(id => id.toString());

  return {
    existingProducts,
    allExist: missingIds.length === 0, // True if all products exist
    missingIds // Array of missing product IDs
  };
}

async function getProductsByIds(listOfId) {
  return await getProductsCollection().find({ _id: { $in: listOfId } }).toArray();
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

function canAffordProducts(user, products) {
  try {
    const totalCost = products.reduce((sum, product) => sum + product.price, 0);
    const totalBalance = user.balances
    return totalCost <= totalBalance;
  } catch (err) {
      return false
  }
}

async function getPurchases() {
  return getPurchasesCollection().find().toArray()
}

async function getPurchasesUser(userId) {
  return getPurchasesCollection().find({userID: new ObjectId(userId)}).toArray()
}

async function updateUserRole(userId, roles) {
  const result = await getUsersCollection().updateOne(
    { _id: new ObjectId(userId) },
    { $set: { role: roles } }
  )
  if (result.matchedCount === 0) {
    throw new UserNotFound()
  }
  return result
}

async function purchase(userID, product) {
  const purchasesCollection = getPurchasesCollection();
  const session = purchasesCollection.client.startSession();

  try {
      session.startTransaction();
      
      // Create the purchase document
      const purchaseDoc = {
          userID: new ObjectId(userID),
          product,
          purchaseDate: new Date(),
      };

      // Insert the purchase and capture the inserted ID
      const insertResult = await purchasesCollection.insertOne(purchaseDoc, { session });

      // Update user balance
      await addToBalances(userID, -product.price, session);

      await session.commitTransaction();

      // Return the full purchase document (fetch it from the database to ensure consistency)
      return await purchasesCollection.findOne({ _id: insertResult.insertedId });
  } catch (error) {
      await session.abortTransaction();
      throw error;
  } finally {
      session.endSession();
  }
}

async function addToBalances(userId, amount, session = null) {
  try {
    const usersCollection = getUsersCollection();
    const options = session ? { session } : {};
    await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $inc: { balances: amount } },
        options
    );
  } catch (err) {
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

module.exports = {
  getProductsCollection,
  getUsersCollection,
  getPurchasesCollection,
  existsUser,
  existsProducts,
  getUserByUsername,
  canAffordProducts,
  getUser,
  getPurchases,
  getPurchasesUser,
  getProductsByIds,
  addProduct,
  updateUserRole,
  purchase,
  addToBalances,
  updateProduct,
  getProducts,
  deleteProduct,
  getProductById
};
