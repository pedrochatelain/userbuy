const service = require('./login.service');

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
        const blacklistedToken = await service.logout(req.body.token)
        res.status(200).json({ message: "User logged out successfully", blacklistedToken})            
    } catch (err) {
        if ( ! err.statusCode)
            err.statusCode = 500
        console.log(err)
        res.status(err.statusCode).json(err)
    }
}

module.exports = { login, logout };
