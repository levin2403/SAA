const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/auth.middleware');
const userController = require('../controllers/users.controller');

const routeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: "Haz realizado demasiadas peticiones, espera un poco he intenta de nuevo.",
    standardHeaders: true, 
    legacyHeaders: false,  
});

router.get('/user/classes', routeLimiter, authenticateToken, userController.getUserClassesById)
//router.get('/classes/members', routeLimiter, authenticateToken, userController.getStudentsByClassId)
router.put('/global_logout', routeLimiter, authenticateToken, userController.handleGlobalLogout);
router.delete('/single_logout', routeLimiter, authenticateToken, userController.handleSingleDeviceLogout);


module.exports = router;