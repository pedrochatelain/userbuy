const service = require('./login.service');
const { verifyToken } = require('../../utils/auth.utils')

const login = async (req, res) => {
    try {
        const loginResult = await service.login(req.body)
        res.status(200).json(loginResult)            
    } catch (err) {
        res.status(err.statusCode).json({ error: err.message })
    }
}

const logout = async (req, res) => {
    try {
        const token = req.body.token
        verifyToken(token)
        const blacklistedToken = await service.logout(token)
        res.status(200).json({ message: "User logged out successfully", blacklistedToken})            
    } catch (err) {
        if ( ! err.statusCode)
            err.statusCode = 500
        res.status(err.statusCode).json(err)
    }
}

module.exports = { login, logout };
