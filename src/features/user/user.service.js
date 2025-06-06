const datasource = require('./user.datasource');
const { UserNotFound } = require('../../errors/customErrors');
const hashPassword = require('../../utils/hashPassword');
const validateAddressWithAI = require('../../utils/validateAddress');

async function getUsers() {
    return await datasource.getActiveUsers();
}

async function createUser(user) {
    try {
        user.password = await hashPassword(user.password)
        if (user.role) {
            user.role = user.role.toUpperCase()
        }
        return await datasource.createUser(user)
    } catch(error) {
        return null
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

async function getBalances(idUser) {
    try {
        const balances = await datasource.getBalances(idUser)
        return { 
            idUser,
            balances 
        }
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

async function addAddress(idUser, address) {
    try {
        const user = await datasource.getUser(idUser)
        user.address = address
        const addressValidation = await validateAddressWithAI(address) 
        if (addressValidation.isValid)
            await datasource.update(idUser, user)
        else
            throw new Error(addressValidation.explanation)
        return user
    } catch (err) {
        throw err
    }
}

module.exports = { createUser, getUsers, editRoles, addToBalances, deleteUser, addAddress, getBalances }