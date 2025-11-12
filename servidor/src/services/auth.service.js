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

    // Seek user in repository
    const user = await userRepository.findByUserId(userId);

    // Validate user credentials
    validateUserCredentials(user, password);

    // Validate number of sessions

    // Generate acces and refresh tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await saveAccesTokenHash(user.id, accessToken); // save acces token hash
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
    throw new Error(error.message || 'Authentication failed');
  }
}

// Verify required fields
function validateInputFields(userId, password) {
  if (!userId || !password) {
    throw new Error('Missing required fields: userId and password');  
  }
}

async function validateNumberOfSessions(){
  try{
    const activeSessions = await userRepository.getNumbreOfSessions();
    if(activeSessions === process.env.MAX_SESSION_NUMBER){
      throw new Error('Numero maximo de sesiones activas alcanzado');
    }
  }
  catch(error){
    throw new Error('Error al validar el numero de sesiones activas');
  }
}

// Validate user credentials
function validateUserCredentials(user, password) {
  if (!user || user.password !== password) {
    throw new Error('Invalid user ID or password');
  }
}

// Generate an access token with short expiration (15 minutes)
function generateAccessToken(user) {
  try{
    return jwt.sign(
      { userId: user.id, tokenVersion: user.tokenVersion },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1m' }
    );
  }
  catch (error) {
    throw new Error('Could not generate access token');
  }
}

// Generate a refresh token with longer expiration (7 days)
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

// Saves the hashed access token in the user repository
async function saveAccesTokenHash(userId, accessToken){
  const accesTokenHash = crypto.createHash('sha256').update(accessToken).digest('hex');
  await userRepository.updateAccesTokenHash(userId, accesTokenHash);
}

// Saves the hashed refresh token in the user repository
async function saveRefreshTokenHash(userId, refreshToken) {
  const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
  await userRepository.updateRefreshTokenHash(userId, refreshTokenHash);
}

module.exports = { authenticateUser };
