const express = require('express');
const router = express.Router();
const userController = require('../controller/user.controller');

router.post('/users/validate_credentials', userController.validateUserCredentials);
router.get('/users/classes', userController.getUserClassesById);

module.exports = router;