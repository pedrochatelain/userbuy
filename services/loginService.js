const { getUserByUsername } = require('../datasources/mongo')
const bcrypt = require('bcrypt');

async function login(user) {
    try {
        const storedUser = await getUserByUsername(user.username)
        const storedHashedPassword = storedUser.password
        if (await match(user.password, storedHashedPassword)) {
            return {
                statusCode: 200,
                message: "Login successful"
            }    
        } else {
            return {
                statusCode: 404,
                message: "Wrong password. Try again"
            }
        }
    } catch(err) {
        return {
            statusCode: 400,
            message: err.message
        }
    }
}

async function match(password, storedHashedPassword) {
    console.log("password", password)
    console.log("storedHashedPassword", storedHashedPassword)
    try {
        const isMatch = await bcrypt.compare(password, storedHashedPassword);
        return isMatch;
    } catch (error) {
        console.error("Error comparing passwords:", error);
        throw error; // Propagate the error for the caller to handle
    }
}

module.exports = { login }