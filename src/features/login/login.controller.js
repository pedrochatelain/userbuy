const service = require('./login.service');

const login = async (req, res) => {
    try {
        const loginResult = await service.login(req.body)
        res.status(200).json(loginResult)            
    } catch (err) {
        res.status(err.statusCode).json({ error: err.message })
    }
}

module.exports = { login };
