const express = require('express');
const router = express.Router();
const loginController = require('./login.controller')

// POST /api/login
router.post('/api/login', loginController.login);

module.exports = router;