const refreshTokenService = require('../services/refreshToken.service');
const logoutService = require('../services/logout.service');
const authService = require('../services/auth.service');
const sessionRepository = require('../repositories/session.repository');
const userService = require('../integration/user.service');

// Controller function to handle token refresh requests
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
    const { id, refreshToken } = req.body;
    console.log("hasta aqui llegue pai");
    try {
        await logoutService.singleDeviceLogout(id, refreshToken);
        res.status(200).json();
    } catch (error) {
        res.status(500).json({ error: error.message }); 
    }
}

// Controller function to get all users
exports.getAllSessions = async (req, res) => {
  try {
    const users = await sessionRepository.getAllSessions();
    res.status(200).json(users);
    } catch (error) {
    res.status(500).json(error.message);
  }
}

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

// Controller function to handle the students of a certain class request
exports.getStudentsByClassId = async(req, res) => 
{
  try {
    const { class_id } = req.query;
    const result = await userService.getStudentsByClassId(class_id);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json(error.message);
  }
}


// Controller function to handle the students of a certain class request
exports.getUserClassesById = async(req, res) => 
  {
    try {
      const { user_id } = req.query;
      const result = await userService.getUserClassesById(user_id);
      res.status(200).json(result);
    } catch (error) {
      res.status(401).json(error.message);
    }
  }

