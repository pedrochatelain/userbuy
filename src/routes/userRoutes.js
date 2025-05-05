const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const validateUser = require('../middlewares/validateUser')
const validateRoleUpdate = require('../middlewares/validateRoleUpdate');
const handleValidationErrors = require('../middlewares/handleValidationErrors');
const validateUserAccess = require('../middlewares/validateUserOrAdmin')
const validateUserOrAdmin = require('../middlewares/validateUserOrAdmin')

// POST /api/users
router.post('/api/users', validateUser, userController.createUser);

// GET /api/users
router.get('/api/users', userController.getUsers);

// PATCH /api/users/:userId/roles
router.patch('/api/users/:userId/roles', validateRoleUpdate, handleValidationErrors, userController.editRoles)

// PATCH /api/users/:userId/balances
router.patch('/api/users/:userId/balances', validateUserAccess, userController.addToBalances)

// DELETE api/users/:idUser
router.delete('/api/users/:idUser', validateUserOrAdmin, userController.deleteUser)

module.exports = router;