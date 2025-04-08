const { MongoClient } = require('mongodb');

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

module.exports = {
  connectDB,
  getProductsCollection,
  getUsersCollection
};
