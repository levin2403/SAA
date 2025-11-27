const mongoose = require('mongoose');
const ClassSessionModel = require('../models/classSession.model');

// Helper para crear ObjectId
const oid = (id) => new mongoose.Types.ObjectId(id);

const seedClassSessions = async () => {
    try {
        // Verify connection
        if (mongoose.connection.readyState !== 1) return;

        console.log('Executing sedeer...');

        
        await ClassSessionModel.deleteMany({});
        console.log('Colections cleaned.');

        
        const sessions = [
            {
                _id: oid("671fd9e2a3b12c7f9c1a1234"),
                classId: "671fd9e2a3b12c7f9c1a0012", // Sistemas Distribuidos
                professorId: "00000250545", // Mtro. Jose Luis
                date: new Date("2025-04-10T08:00:00.000Z"), // 10 de Abril
                attendances: [
                    {
                        id: "00000247527",
                        name: "Jesus Gabriel Medina Leyva",
                        status: "PRESENT"
                    },
                    {
                        id: "00000240798",
                        name: "Kevin Jared Sanchez Figueroa",
                        status: "ABSENT"
                    }
                ]
            },
            {
                _id: oid("691bb1a2e60ec5039b35ee1d"),
                classId: "671fd9e2a3b12c7f9c1a0012", // Sistemas Distribuidos
                professorId: "00000250545", // Mtro. Jose Luis
                date: new Date("2025-04-15T08:00:00.000Z"), // 15 de Abril
                attendances: [
                    {
                        id: "00000247527",
                        name: "Jesus Gabriel Medina Leyva",
                        status: "ABSENT"
                    },
                    {
                        id: "00000240798",
                        name: "Kevin Jared Sanchez Figueroa",
                        status: "ABSENT"
                    }
                ]
            }
        ];

        // 3. Insertar datos
        await ClassSessionModel.insertMany(sessions);
        console.log(`Database populated correctly.`);

    } catch (error) {
        console.error('An error ocurred while populating the database', error);
    }
};

module.exports = seedClassSessions;