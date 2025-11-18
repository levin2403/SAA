const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const classSessionController = require('../controllers/classSession.controller');

const routeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: "Haz realizado demasiadas peticiones, espera un poco he intenta de nuevo.",
    standardHeaders: true, 
    legacyHeaders: false,  
});

router.get('/class/session', routeLimiter, classSessionController.getClassSession);


module.exports = router;