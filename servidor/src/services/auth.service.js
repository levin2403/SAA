require('dotenv').config();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sessionRepository = require('../repositories/session.repository');
const userService = require('../integration/user.service');

/**
 * Authenticates a user and generates access and refresh tokens.
 * @param {String} userId 
 * @param {String} password 
 * @returns User object with the necessary information.
 */
async function authenticateUser(userId, password) {
  try {
    // Validate input fields
    validateInputFields(userId, password);

    // Validate user credentials
    const user = await validateUserCredentials(userId, password);

    //get the user session
    const userSession = await findSessionByUserId(userId)

    // Validates the user amounts of sessions
    await validateNumberOfSessions(userSession)

    // Generate acces and refresh tokens
    const accessToken = generateAccessToken(user, userSession);
    const refreshToken = generateRefreshToken(user, userSession);

    await saveRefreshTokenHash(userId, refreshToken); // save refresh token hash

    // Return user data and tokens
    return {
      user: {
        id: user.id,
        name: user.name,
        rol: user.rol,
      },
      tokens: {
        access: accessToken,
        refresh: refreshToken,
      },
    };
  } catch (error) {
    console.error('Authentication error:', error.message);
    throw new Error(error.message);
  }
}

// Verify required fields
function validateInputFields(userId, password) {
  if (!userId || !password) {
    throw new Error('Missing required fields: userId and password');
  }
}

// Find session by id
async function findSessionByUserId(userId){
  try{
      const session = await sessionRepository.findBySessionId(userId);
      return session;
  }
  catch(error){
      throw new Error("No se pudo refrescar el token de acceso");
  }
}

// Validate if the number of sessions is under the permited limit
async function validateNumberOfSessions(sessions){
  try{
    const activeSessions = sessions.refreshTokens.length; //amount of sessions
    if (activeSessions === Number(process.env.MAX_SESSION_NUMBER)) {
      throw new Error('Numero maximo de sesiones activas alcanzado');
    }
  }
  catch(error){
    throw new Error('Numero maximo de sesiones activas alcanzado');
  }
}

// Validate user credentials in the ITSON API
async function validateUserCredentials(userId, password) 
{
  try{
      const response = await userService.validateUserCredentials(userId, password);
      return response.user;
  }
  catch(error){
      throw new Error(error.message);
  }
}

/**
 * Generate an access token with short expiration (15 minutes) 
 * @param {*} user 
 * @returns 
 */
function generateAccessToken(user, userSession) 
{
    return jwt.sign(
      { userId: user.id, userName: user.name, rol: user.rol, tokenVersion: userSession.tokenVersion },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );
}

/**
 * Generate a refresh token with longer expiration (7 days)
 * @param {Object} user 
 * @returns 
 */
function generateRefreshToken(user, userSession) 
{
    return jwt.sign(
      { userId: user.id, userName: user.name, rol: user.rol, tokenVersion: userSession.tokenVersion  },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );
}

/**
 * Saves the hashed refresh token in the user repository
 * @param {String} userId
 * @param {String} refreshToken
 */
async function saveRefreshTokenHash(userId, refreshToken) {
  const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
  await sessionRepository.addNewRefreshTokenHash(userId, refreshTokenHash);
}

module.exports = { authenticateUser };
