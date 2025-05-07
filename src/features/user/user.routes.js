const express = require('express');
const router = express.Router();
const userController = require('./user.controller')
const validateUser = require('../../middlewares/validateUser')
const validateRoleUpdate = require('../../middlewares/validateRoleUpdate');
const handleValidationErrors = require('../../middlewares/handleValidationErrors');
const validateUserAccess = require('../../middlewares/validateUserAccess')
const validateUserOrAdmin = require('../../middlewares/validateUserOrAdmin')
const validateObjectId = require('../../middlewares/validateObjectId');

// POST /api/users
router.post('/api/users', validateUser, userController.createUser);

// GET /api/users
router.get('/api/users', userController.getUsers);

// PATCH /api/users/:userId/roles
router.patch(
  '/api/users/:userId/roles',
  validateObjectId('userId'),
  validateRoleUpdate,
  handleValidationErrors,
  userController.editRoles
);

// PATCH /api/users/:userId/balances
router.patch(
  '/api/users/:userId/balances',
  validateObjectId('userId'),
  validateUserAccess,
  userController.addToBalances
);

// DELETE /api/users/:idUser
router.delete(
  '/api/users/:idUser',
  validateObjectId('idUser'),
  validateUserOrAdmin,
  userController.deleteUser
);

module.exports = router;
