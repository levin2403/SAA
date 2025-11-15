const express = require('express');
const router = express.Router();
const classController = require('../controller/class.controller');

// Route to get the students of a class
router.get('/classes/students', classController.getStudentsByClassId);

module.exports = router;