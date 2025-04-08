const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')

// POST /api/users
router.post('/api/users', userController.createUser);

module.exports = router;
