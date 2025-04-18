const { MongoClient } = require('mongodb');

let dbInstance = null;

async function connectDB() {
  const client = new MongoClient(process.env.MONGO_URI, {
    ssl: true, // Explicitly enable SSL
    tlsAllowInvalidCertificates: false, // Ensure TLS validation
  });
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
