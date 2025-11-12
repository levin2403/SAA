const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  userId: {type: String, required: true, match: /^0{5}\d{5}$/},
  tokenVersion: {type: Number, required: true },
  lastConnection: { type: Date, default: Date.now},
  refreshTokens: [
    {
      hashedRefreshToken: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
      expiresAt: { type: Date }
    }
  ]
});

// Index for fast search
SessionSchema.index({userId: 1});

// opcional: para limpiar sesiones inactivas viejas (TTL)
//SessionSchema.index({ 'refreshTokens.expiresAt': 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Session', SessionSchema);
