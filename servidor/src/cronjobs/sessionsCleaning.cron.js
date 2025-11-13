//const cron = require('node-cron');
//const sessionModel = require('../models/session');

// Ejecutar todos los días a las 3 AM
//cron.schedule('0 3 * * *', async () => {
//  const now = new Date();
//  try {
//    const result = await sessionModel.updateMany(
//      {},
//      { $pull: { refreshTokens: { expiresAt: { $lt: now } } } }
//    );
//    console.log(`[CLEANER] Tokens expirados eliminados (${result.modifiedCount} sesiones actualizadas)`);
//  } catch (err) {
//    console.error('[CLEANER] Error limpiando tokens expirados:', err.message);
//  }
//});