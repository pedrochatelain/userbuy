const express = require('express');
const router = express.Router();
const userController = require('./user.controller')
const validateUserCreation = require('../../middlewares/validateUserCreation')
const validateRoleUpdate = require('../../middlewares/validateRoleUpdate');
const handleValidationErrors = require('../../middlewares/handleValidationErrors');
const validateUserAccess = require('../../middlewares/validateUserAccess')
const validateUserOrAdmin = require('../../middlewares/validateUserOrAdmin')
const validateObjectId = require('../../middlewares/validateObjectId');
const authorizeAdmin = require('../../middlewares/authorizeAdmin');
const validateAddress = require('../../middlewares/validateAddress');

// POST /api/users
router.post('/api/users', validateUserCreation, userController.createUser);

// GET /api/users
router.get('/api/users', userController.getUsers);

// Update user role
router.patch(
  '/api/users/:idUser/roles',
  authorizeAdmin,
  validateObjectId('idUser'),
  validateRoleUpdate,
  handleValidationErrors,
  userController.editRoles
);

// Get user balances
router.get(
  '/api/users/:idUser/balances',
  validateUserAccess,
  userController.getBalances
);

// Add address
router.post(
  '/api/users/:idUser/address',
  validateAddress,
  validateObjectId('idUser'),
  validateUserAccess,
  userController.addAddress
);

// PATCH /api/users/:idUser/balances
router.patch(
  '/api/users/:idUser/balances',
  validateObjectId('idUser'),
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
