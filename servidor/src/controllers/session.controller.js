// Controller function to handle token refresh requests
const refreshTokenService = require('../services/refreshToken.service');
const authService = require('../services/auth.service');
const logoutService = require('../services/logout.service');


// Controller function to handle authentication requests
exports.handleAuthentication = async(req, res) => {
    try {
      const { id, password } = req.body;
      const result = await authService.authenticateUser(id, password);
      res.status(200).json(result);
    } catch (error) {
      res.status(401).json(error.message);
    }
  }

// Controller function to handle the token refresh
exports.handleTokenRefresh = async (req, res) => {
    try {
        const { refresh_token } = req.body;
        const newTokens =  await refreshTokenService.refreshAccessToken(refresh_token);
        res.status(200).json(newTokens);
    } catch (error) {
        res.status(403).json({ error: error.message });
    }
}


// Controller function to handle logout requests
exports.handleGlobalLogout = async (req, res) => {
  const { id } = req.body;
  try {
      await logoutService.globalLogout(id);
      res.status(200).json();
  } catch (error) {
      res.status(500).json({ error: error.message }); 
  }
}

// Controller function to handle single device logout requests
exports.handleSingleDeviceLogout = async (req, res) => {
  const { id, refresh_token } = req.body;
  try {
      await logoutService.singleDeviceLogout(id, refresh_token);
      res.status(200).json();
  } catch (error) {
      res.status(500).json({ error: error.message }); 
  }
}