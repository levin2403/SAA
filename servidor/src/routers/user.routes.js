const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/auth.middleware');
const userController = require('../controllers/users.controller');
const connectDB = require('../config/db');  

connectDB(); //dattabase connection

router.get('/users', authenticateToken, userController.getAllSessions); // Route to get all users
router.get('/user/classes', authenticateToken, userController.getUserClassesById)
router.get('/classes/members', authenticateToken, userController.getStudentsByClassId)


module.exports = router;