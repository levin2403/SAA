const mongoose = require('mongoose');
const sessionModel = require('../models/session.model');

const oid = (id) => new mongoose.Types.ObjectId(id);

const seedSessions = async () => {
    try {
        // Verify connection before starting
        if (mongoose.connection.readyState !== 1) return;

        console.log('Executing session sedeer...');

        await Promise.all([
            sessionModel.deleteMany({})
        ]);
        console.log('Colection cleaned.');

        const sessions = [
            // Students
            { userId: "00000247527", tokenVersion: 0, refreshTokens: [] },
            { userId: "00000240798", tokenVersion: 0, refreshTokens: [] },
            { userId: "00000240001", tokenVersion: 0, refreshTokens: [] },
            { userId: "00000240002", tokenVersion: 0, refreshTokens: [] },
            { userId: "00000240003", tokenVersion: 0, refreshTokens: [] },
            { userId: "00000240004", tokenVersion: 0, refreshTokens: [] },
            { userId: "00000240005", tokenVersion: 0, refreshTokens: [] },
            { userId: "00000240006", tokenVersion: 0, refreshTokens: [] },
            { userId: "00000240007", tokenVersion: 0, refreshTokens: [] },
            { userId: "00000240008", tokenVersion: 0, refreshTokens: [] },

            // Professors
            { userId: "00000240474", tokenVersion: 0, refreshTokens: [] },
            { userId: "00000250545", tokenVersion: 0, refreshTokens: [] },
            { userId: "00000250546", tokenVersion: 0, refreshTokens: [] },
            { userId: "00000250547", tokenVersion: 0, refreshTokens: [] },
            { userId: "00000250548", tokenVersion: 0, refreshTokens: [] },
            { userId: "00000250549", tokenVersion: 0, refreshTokens: [] },
            { userId: "00000250550", tokenVersion: 0, refreshTokens: [] },
            { userId: "00000250551", tokenVersion: 0, refreshTokens: [] }
        ];
        await sessionModel.insertMany(sessions);

        console.log('The sessions has benn populated correctly.');

    } catch (error) {
        console.error('An error ocurred while populating the sessions', error);
    }
};

module.exports = seedSessions;