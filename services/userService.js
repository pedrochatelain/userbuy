const { getUsersCollection } = require('../datasources/mongo')

async function createUser(user) {
    const usersCollection = getUsersCollection()
    const result = await usersCollection.insertOne(user);
    // Check if the document exists in the database
    return await usersCollection.findOne({ _id: result.insertedId });
}

module.exports = { createUser }