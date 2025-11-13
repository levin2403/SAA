require('dotenv').config();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const userRepository = require('../repositories/user.repository');

/**
 * Authenticates a user and generates access and refresh tokens.
 * 
 */
async function authenticateUser(userId, password) {
  try {
    // Validate input fields
    validateInputFields(userId, password);

    // Validate user credentials
    const user = await validateUserCredentials(userId, password);

    // Validates the user amounts of sessions
    await validateNumberOfSessions(user)

    // Validate number of sessions

    // Generate acces and refresh tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await saveRefreshTokenHash(user.id, refreshToken); // save refresh token hash

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
    console.error('Authentication error:', error);
    throw new Error(error.message);
  }
}

// Verify required fields
function validateInputFields(userId, password) {
  if (!userId || !password) {
    throw new Error('Missing required fields: userId and password');
  }
}

async function validateNumberOfSessions(user){
  try{
    const activeSessions = await userRepository.getNumbreOfSessions(user.id);
    if (activeSessions === Number(process.env.MAX_SESSION_NUMBER)) {
      throw new Error('Numero maximo de sesiones activas alcanzado');
    }
  }
  catch(error){
    throw new Error('Numero maximo de sesiones activas alcanzado');
  }
}

// Validate user credentials in the ITSON API
function validateUserCredentials(user, password) {
  return {
        id: '0000012345',
        name: 'Magic Jhonson',
        rol: 'ESTUDIANTE',
  }
}

/**
 * Generate an access token with short expiration (15 minutes) 
 * @param {*} user 
 * @returns 
 */
function generateAccessToken(user) {
  try{
    return jwt.sign(
      { userId: user.id, tokenVersion: user.tokenVersion },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );
  }
  catch (error) {
    throw new Error('Could not generate access token');
  }
}

/**
 * Generate a refresh token with longer expiration (7 days)
 * @param {*} user 
 * @returns 
 */
function generateRefreshToken(user) {
  try{
    return jwt.sign(
      { userId: user.id, tokenVersion: user.tokenVersion },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );
  }
  catch (error) {
    throw new Error('Could not generate refresh token');
  }
}

/**
 * Saves the hashed refresh token in the user repository
 * @param {*} userId 
 * @param {*} refreshToken 
 */
async function saveRefreshTokenHash(userId, refreshToken) {
  const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
  await userRepository.addNewRefreshTokenHash(userId, refreshTokenHash);
}

module.exports = { authenticateUser };
