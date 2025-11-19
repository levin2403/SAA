const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const authenticateToken = require('../middlewares/auth.middleware');
const userController = require('../controllers/users.controller');

const routeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: "Haz realizado demasiadas peticiones, espera un poco he intenta de nuevo.",
    standardHeaders: true, 
    legacyHeaders: false,  
});

router.get('/student/classes', routeLimiter, userController.getStudentClassesById)
router.get('/professor/classes', routeLimiter, userController.getProfessorClassesById)


module.exports = router;