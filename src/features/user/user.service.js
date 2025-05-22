const bcrypt = require('bcryptjs');
const datasource = require('./user.datasource');
const { UserNotFound } = require('../../errors/customErrors');

async function getUsers() {
    return await datasource.getUsersCollection().find().toArray();
}

async function createUser(user) {
    try {
        user.password = await hashPassword(user.password)
        if (user.role) {
            user.role = user.role.toUpperCase()
        }
        const usersCollection = await datasource.getUsersCollection()
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

async function editRoles(idUser, roles) {
    try {
        await datasource.updateUserRole(idUser, roles)
        return datasource.getUser(idUser)
    } catch (err) {
        throw err
    }
}

async function addToBalances(idUser, amount) {
    try {
        if ( ! await datasource.existsUser(idUser)) {
            throw new UserNotFound()
        }
        await datasource.addToBalances(idUser, amount)
        return datasource.getUser(idUser)
    } catch (err) {
        throw err
    }
}

async function deleteUser(idUser) {
    try {
        if ( ! await datasource.existsUser(idUser)) {
            throw new UserNotFound()
        }
        return await datasource.deleteUser(idUser)
    } catch (err) {
        throw err
    }
}

module.exports = { createUser, getUsers, editRoles, addToBalances, deleteUser }