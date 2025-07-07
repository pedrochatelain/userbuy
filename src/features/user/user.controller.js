const service = require('./user.service');
const { validationResult } = require('express-validator');

const createUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const user = req.body;
    try {
        await service.createUser(user)
        res.status(201).json({ message: 'User created successfully', user })
    } catch(err) {
        if ( ! err.statusCode)
            err.statusCode = 500
        res.status(err.statusCode).json({error: err.message})
    }
}

const getUsers = async (req, res) => {
    try {
        const users = await service.getUsers()
        res.status(200).json(users)
    } catch(err) {
        res.status(500).json({error: "Error fetching users"})
    }
}

const editRoles = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const idUser = req.params.idUser
    const roles = req.body.role
    try {
        const user = await service.editRoles(idUser, roles)
        res.status(200).json({message: "Role updated successfully", user})
    } catch(err) {
        if ( ! err.statusCode)
            err.statusCode = 500
        res.status(err.statusCode).json(err)
    }
}

const addToBalances = async (req, res) => {
    try {
        const idUser = req.params.idUser
        const amount = req.body.amount
        if (amount < 0) {
            return res.status(400).json({error: "Amount must be a positive number"})
        }
        const response = await service.addToBalances(idUser, amount)
        res.status(200).json({message: "User balances updated successfully", response})
    } catch (err) {
        if ( ! err.statusCode)
            err.statusCode = 500
        res.status(err.statusCode).json({error: err.message})
    }
}

const getBalances = async (req, res) => {
    try {
        const idUser = req.params.idUser
        const response = await service.getBalances(idUser)
        res.status(200).json(response)
    } catch (err) {
        if ( ! err.statusCode)
            err.statusCode = 500
        res.status(err.statusCode).json({error: err.message})
    }
}

const addAddress = async (req, res) => {
    try {
        const response = await service.addAddress(req.params.idUser, req.body)
        res.status(200).json({message: "Address added successfully", user: response})
    } catch (err) {
        if ( ! err.statusCode)
            err.statusCode = 500
        res.status(err.statusCode).json(err.message)
    }
}

const deleteUser = async (req, res) => {
    try {
        const idUser = req.params.idUser
        const deletedUser = await service.deleteUser(idUser)
        res.status(200).json({message: "User deleted successfully", deletedUser})
    } catch (err) {
        if ( ! err.statusCode)
            err.statusCode = 500
        res.status(err.statusCode).json(err)
    }

}

module.exports = { createUser, getUsers, editRoles, addToBalances, deleteUser, addAddress, getBalances };
