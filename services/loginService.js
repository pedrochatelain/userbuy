const { getUserByUsername } = require('../datasources/mongo')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
    return { 
        success: true,
        token: generateToken(storedUser)
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

module.exports = { login }