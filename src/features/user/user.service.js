const datasource = require('./user.datasource');
const { UserNotFound } = require('../../errors/customErrors');
const hashPassword = require('../../utils/hashPassword')

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