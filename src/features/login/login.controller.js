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
        verifyToken(req)
        const blacklistedToken = await service.logout(req.body.token)
        res.status(200).json({ message: "User logged out successfully", blacklistedToken})            
    } catch (err) {
        if ( ! err.statusCode)
            err.statusCode = 500
        res.status(err.statusCode).json({err, message: err.message})
    }
}

module.exports = { login, logout };
