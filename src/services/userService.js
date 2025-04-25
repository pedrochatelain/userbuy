const { getUsersCollection } = require('../datasources/mongoDatasource')
const bcrypt = require('bcrypt');
const datasource = require('../datasources/mongoDatasource')

async function getUsers() {
    return getUsersCollection().find().toArray();
}

async function createUser(user) {
    try {
        user.password = await hashPassword(user.password)
        const usersCollection = getUsersCollection()
        const result = await usersCollection.insertOne(user);
        // Check if the document exists in the database
        return await usersCollection.findOne({ _id: result.insertedId });

    } catch(error) {
        return null
    }
}

async function hashPassword(password) {
    const saltRounds = 10; // Adjust as needed
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.error("Error hashing password:", error);
        throw error;
    }
}

async function editRoles(userId, roles) {
    try {
        await datasource.updateUserRole(userId, roles)
        return datasource.getUser(userId)
    } catch (err) {
        console.log(err)
        throw err
    }
}

module.exports = { createUser, getUsers, editRoles }