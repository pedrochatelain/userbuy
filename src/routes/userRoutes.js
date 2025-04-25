const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const validateUser = require('../middlewares/validateUser')
const validateRoleUpdate = require('../middlewares/validateRoleUpdate');
const handleValidationErrors = require('../middlewares/handleValidationErrors');

// POST /api/users
router.post('/api/users', validateUser, userController.createUser);

// GET /api/users
router.get('/api/users', userController.getUsers);

// PATCH /api/users/:userId/roles
router.patch('/api/users/:userId/roles', validateRoleUpdate, handleValidationErrors, userController.editRoles)

module.exports = router;