const { MongoClient } = require('mongodb');
const config = require('./config');

let dbInstance = null;

async function connectDB() {
  const client = new MongoClient(config.mongoUri);
  await client.connect();
  dbInstance = client.db(config.databaseName);
  console.log(`Connected to MongoDB: ${config.databaseName}`);
}

function getDb() {
  if (!dbInstance) {
    throw new Error('Database not connected!');
  }
  return dbInstance;
}

module.exports = {
  connectDB,
  getDb,
};
