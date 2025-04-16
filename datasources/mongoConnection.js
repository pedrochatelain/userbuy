const { MongoClient } = require('mongodb');

let dbInstance = null;

async function connectDB() {
  const client = new MongoClient('mongodb://localhost:27017');
  await client.connect();
  dbInstance = client.db('mydatabase');
  console.log(`Connected to MongoDB: mydatabase`);
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
