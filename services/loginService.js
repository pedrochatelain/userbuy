const { getUserByUsername } = require('../datasources/mongo')
const bcrypt = require('bcrypt');

async function login(user) {
    const storedUser = await getUserByUsername(user.username)
    if (storedUser == null) {
        return {
            userNotFound: true
        }
    }
    const storedHashedPassword = storedUser.password
    if ( ! await match(user.password, storedHashedPassword)) {
        return {
            wrongCredentials: true
        }
    }
    return { success: true }
}

async function match(password, storedHashedPassword) {
    return await bcrypt.compare(password, storedHashedPassword);
}

module.exports = { login }