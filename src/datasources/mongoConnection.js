const { MongoClient } = require('mongodb');

let dbInstance = null;

async function connectDB() {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  dbInstance = client.db(process.env.DATABASE_NAME);
  console.log(`Connected to MongoDB: ${process.env.DATABASE_NAME}`);
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
