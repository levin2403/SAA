const mongoose = require('mongoose');
const ClassSessionModel = require('../models/classSession.model'); // Asegúrate que la ruta al modelo sea correcta

// Helper para crear ObjectId
const oid = (id) => new mongoose.Types.ObjectId(id);

const seedClassSessions = async () => {
    try {
        // Verificamos conexión
        if (mongoose.connection.readyState !== 1) return;

        console.log('🌱 [Servidor Asistencias] Ejecutando Seeder de Sesiones...');

        // 1. Limpiar la colección de sesiones (Borra todo para evitar duplicados)
        await ClassSessionModel.deleteMany({});
        console.log('🧹 Colección classsessions limpiada.');

        // 2. Definir los datos de las sesiones (Basado en tu txt)
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
        console.log(`✅ Se insertaron ${sessions.length} sesiones de clase.`);
        console.log('🏁 [Servidor Asistencias] Base de datos lista.\n');

    } catch (error) {
        console.error('❌ Error en Seeder de Asistencias:', error);
    }
};

module.exports = seedClassSessions;