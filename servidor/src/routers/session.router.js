const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const sessionController = require('../controllers/session.controller');


const sensibleRouteLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5, // Limit each IP to 5 login requests per `window`
    message: "Too many attempts from this IP, please try again later.",
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false,  // Disable the `X-RateLimit-*` headers
});

const routeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: "Haz realizado demasiadas peticiones, espera un poco he intenta de nuevo.",
    standardHeaders: true, 
    legacyHeaders: false,  
});

// public routes
router.post('/login', sensibleRouteLimiter, sessionController.handleAuthentication); // Route to handle user login
router.post('/refresh_token', sensibleRouteLimiter, sessionController.handleTokenRefresh); // Route to refresh access token
router.put('/global_logout', routeLimiter, sessionController.handleGlobalLogout);
router.delete('/single_logout', routeLimiter, sessionController.handleSingleDeviceLogout); 


module.exports = router;