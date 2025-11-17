const express = require('express');
const router = express.Router();
const userController = require('../controller/user.controller');

router.post('/users/validate_credentials', userController.validateUserCredentials);
router.get('/student/classes', userController.getStudentClassesById);
router.get('/professor/classes', userController.getProfessorClassesById);

module.exports = router;