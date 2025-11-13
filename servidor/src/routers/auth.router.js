const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const authenticateToken = require('../middlewares/auth.middleware');
const userController = require('../controllers/users.controller');


const sensibleRouteLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5, // Limit each IP to 5 login requests per `window`
    message: "Too many attempts from this IP, please try again later.",
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false,  // Disable the `X-RateLimit-*` headers
});

const strictRouteLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true, 
    legacyHeaders: false,  
});

// public routes
router.post('/login', sensibleRouteLimiter, userController.handleAuthentication); // Route to handle user login
router.post('/refresh_token', sensibleRouteLimiter, userController.handleTokenRefresh); // Route to refresh access token

// protected routes
router.put('/global_logout', strictRouteLimiter, authenticateToken, userController.handleGlobalLogout);
router.delete('/single_logout', strictRouteLimiter, authenticateToken, userController.handleSingleDeviceLogout);


module.exports = router;