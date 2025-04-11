const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const validateUser = require('../middlewares/validateUser')

// POST /api/users
router.post('/api/users', validateUser, userController.createUser);

module.exports = router;
