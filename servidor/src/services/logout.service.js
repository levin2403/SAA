const crypto = require('crypto');
const sessionRepository = require('../repositories/session.repository');

/**
 * Function to handle user logout.
 * @param {String} userId 
 */
exports.globalLogout = async (userId) =>
{
    try {
        await sessionRepository.incrementTokenVersion(userId);
    } catch (error) {
        console.error('Logout error:', error);
        throw new Error('Logout failed');
    }
}  

/**
 * Controller function that handles a single device logout.
 * @param {String} userId 
 * @param {String} refreshToken 
 */
exports.singleDeviceLogout = async (userId, refreshToken) => 
{
    try{
        const hashedRefreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
        await sessionRepository.singleLogout(userId, hashedRefreshToken);
    }
    catch(error){
        throw new Error(error.message)
    }
}
