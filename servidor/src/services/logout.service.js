const userRepository = require('../repositories/user.repository');
const crypto = require('crypto');


// Function to handle user logout
exports.globalLogout = async (userId) =>{
    try {
        await userRepository.incrementTokenVersion(userId);
    } catch (error) {
        console.error('Logout error:', error);
        throw new Error('Logout failed');
    }
}

exports.singleDeviceLogout = async (userId, refreshToken) => {
    try{
        const hashedRefreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
        await userRepository.singleLogout(userId, hashedRefreshToken);
    }
    catch(error){
        throw new Error(error.message)
    }
}
