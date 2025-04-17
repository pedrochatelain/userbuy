const service = require('../services/loginService');

const login = async (req, res) => {
    const user = req.body;
    const loginResult = await service.login(user)
    if (loginResult.success) {
        res.status(200).json(loginResult)            
    } else {
        if (loginResult.wrongCredentials) {
            return res.status(400).json({"error": "Invalid credentials. Try again"})            
        }
        if (loginResult.userNotFound) {
            return res.status(404).json({"error": "User not found"})            
        }
    }
}

module.exports = { login };
