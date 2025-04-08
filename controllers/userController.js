const service = require('../services/userService');

const createUser = async (req, res) => {
    const user = req.body;
    const userCreation = await service.createUser(user)
    if (userCreation) {
        res.status(201).json({ message: 'User created successfully', user })
    } else {
        res.status(400).json({message: "couldn't create user"})
    }
}

module.exports = { createUser };
