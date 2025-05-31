const { getUserByUsername } = require('../user/user.datasource')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserNotFound, InvalidCredentials, DeletedUser } = require('../../errors/customErrors')
const datasource = require('./login.datasource')

async function login(user) {
    const storedUser = await getUserByUsername(user.username)
    if (storedUser == null) {
        throw new UserNotFound()
    }
    const storedHashedPassword = storedUser.password
    if ( ! await match(user.password, storedHashedPassword)) {
        throw new InvalidCredentials()
    }
    if (storedUser.isDeleted) {
        throw new DeletedUser()
    }
    return { 
        message: "User logged in successfully",
        token: generateToken(storedUser),
        user: storedUser
    }
}

async function logout(token) {
    try {
        const result = await datasource.addToBlacklist(token)
        return result.token
    } catch (err) {
        throw err
    }
}

function generateToken(user) {
    const SECRET_KEY = process.env.JWT_SECRET;
    const payload = {
        id: user._id,
        username: user.username,
        role: user.role,
    };
    const options = {
        expiresIn: '1h', // Token expires in 1 hour
    };
    return jwt.sign(payload, SECRET_KEY, options);
}

async function match(password, storedHashedPassword) {
    return await bcrypt.compare(password, storedHashedPassword);
}

module.exports = { login, logout }