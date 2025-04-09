const service = require('../services/loginService');

const login = async (req, res) => {
    const user = req.body;
    const loginResult = await service.login(user)
    if (loginResult.successful) {
        res.status(loginResult.statusCode).json({"message": `${loginResult.message}`})
    } else {
        res.status(loginResult.statusCode).json({"message": `${loginResult.message}`})
    }
}

module.exports = { login };
