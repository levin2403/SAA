// Controller function to handle token refresh requests
const refreshTokenService = require('../services/refreshToken.service');
const authService = require('../services/auth.service');


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

exports.handleTokenRefresh = async (req, res) => {
    try {
        const { refresh_token } = req.body;
        const newTokens =  await refreshTokenService.refreshAccessToken(refresh_token);
        res.status(200).json(newTokens);
    } catch (error) {
        res.status(403).json({ error: error.message });
    }
}

// Controller function to get all users
//exports.getAllSessions = async (req, res) => {
//  try {
//    const users = await sessionRepository.getAllSessions();
//    res.status(200).json(users);
//    } catch (error) {
//    res.status(500).json(error.message);
//  }
//}