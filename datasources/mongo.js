const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

let db;

async function connectDB() {
  await client.connect();
  db = client.db('mydatabase');
  console.log('MongoDB connected');
}

function getDb() {
  if (!db) throw new Error('Database not connected!');
  return db;
}

function getProductsCollection() {
  return getDb().collection('products');
}

function getUsersCollection() {
  return getDb().collection('users');
}

function getPurchasesCollection() {
  return getDb().collection('purchases');
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
    allExist: missingIds.length === 0, // True if all products exist
    missingIds // Array of missing product IDs
  };
}

module.exports = {
  connectDB,
  getProductsCollection,
  getUsersCollection,
  getPurchasesCollection,
  existsUser,
  existsProducts,
  getUserByUsername
};
