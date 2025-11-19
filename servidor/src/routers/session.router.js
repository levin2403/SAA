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

// public routes
router.post('/login', sensibleRouteLimiter, sessionController.handleAuthentication); // Route to handle user login
router.post('/refresh_token', sensibleRouteLimiter, sessionController.handleTokenRefresh); // Route to refresh access token
router.put('/global_logout', routeLimiter, authenticateToken, sessionController.handleGlobalLogout);
router.delete('/single_logout', routeLimiter, authenticateToken, sessionController.handleSingleDeviceLogout); 


module.exports = router;