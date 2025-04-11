const service = require('../services/userService');
const { validationResult } = require('express-validator');

const createUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const user = req.body;
    const userCreation = await service.createUser(user)
    if (userCreation) {
        res.status(201).json({ message: 'User created successfully', user })
    } else {
        res.status(400).json({message: "couldn't create user"})
    }
}

module.exports = { createUser };
