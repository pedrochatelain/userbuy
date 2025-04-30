const { getUsersCollection } = require('../datasources/mongoDatasource')
const bcrypt = require('bcryptjs');
const datasource = require('../datasources/mongoDatasource');
const { UserNotFound } = require('../errors/customErrors');

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

async function addToBalances(userId, amount) {
    try {
        if ( ! await datasource.existsUser(userId)) {
            throw new UserNotFound()
        }
        await datasource.addToBalances(userId, amount)
        return datasource.getUser(userId)
    } catch (err) {
        throw err
    }
}

module.exports = { createUser, getUsers, editRoles, addToBalances }