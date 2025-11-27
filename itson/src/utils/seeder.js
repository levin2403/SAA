const mongoose = require('mongoose');
const UserModel = require('../model/user.model');
const ClassModel = require('../model/class.model');

// Función auxiliar para crear ObjectId
const oid = (id) => new mongoose.Types.ObjectId(id);

const seedDatabase = async () => {
    try {
        // Verificamos que haya conexión antes de intentar nada
        if (mongoose.connection.readyState !== 1) return;

        console.log('🌱 Ejecutando Seeder (Limpieza y Carga de datos)...');

        // 1. Limpiar colecciones existentes
        // Usamos deleteMany({}) para borrar todo, similar a tus deleteOne pero más seguro para resets completos
        await Promise.all([
            UserModel.deleteMany({}),
            ClassModel.deleteMany({})
        ]);
        
        console.log('🧹 Colecciones limpiadas.');

        // 2. Definir Usuarios (Alumnos y Maestros)
        const users = [
            // --- ALUMNOS ---
            {
                _id: oid("671fd9e2a3b12c7f9c1a1001"),
                id: "00000247527",
                password: "pass12345",
                name: "Jesus Gabriel Medina Leyva",
                rol: 'STUDENT',
                classes: [
                    oid("671fd9e2a3b12c7f9c1a0011"),
                    oid("671fd9e2a3b12c7f9c1a0012"),
                    oid("671fd9e2a3b12c7f9c1a0013")
                ]
            },
            {
                _id: oid("671fd9e2a3b12c7f9c1a1002"),
                id: "00000240798",
                password: "pass12345",
                name: "Kevin Jared Sanchez Figueroa",
                rol: 'STUDENT',
                classes: [
                    oid("671fd9e2a3b12c7f9c1a0011"),
                    oid("671fd9e2a3b12c7f9c1a0012"),
                    oid("671fd9e2a3b12c7f9c1a0013")
                ]
            },
            // --- PROFESORES ---
            {
                _id: oid("671fd9e2a3b12c7f9c1a1003"),
                id: "00000240474",
                password: "pass12345",
                name: "Dr. Gilberto Borrego Soto",
                rol: 'PROFESSOR',
                classes: [
                    oid("671fd9e2a3b12c7f9c1a0011")
                ]
            },
            {
                _id: oid("671fd9e2a3b12c7f9c1a1004"),
                id: "00000250545",
                password: "pass12345",
                name: "Mtro. Jose Luis Robles Reyes",
                rol: 'PROFESSOR',
                classes: [
                    oid("671fd9e2a3b12c7f9c1a0012"),
                    oid("671fd9e2a3b12c7f9c1a0013")
                ]
            }
        ];

        // 3. Definir Clases
        const classes = [
            {
                _id: oid("671fd9e2a3b12c7f9c1a0011"),
                code: "MAT-301",
                name: "Arquitecturas empresariales",
                days: ["Martes", "Jueves"],
                hours: "13:00 - 14:30",
                teacher: oid("671fd9e2a3b12c7f9c1a1003"), // Gilberto
                students: [
                    oid("671fd9e2a3b12c7f9c1a1001"), // Jesus
                    oid("671fd9e2a3b12c7f9c1a1002")  // Kevin
                ]
            },
            {
                _id: oid("671fd9e2a3b12c7f9c1a0012"),
                code: "CS-201",
                name: "Sistemas Distribuidos",
                days: ["Lunes", "Miercoles"],
                hours: "14:00 - 15:30",
                teacher: oid("671fd9e2a3b12c7f9c1a1004"), // Jose Luis
                students: [
                    oid("671fd9e2a3b12c7f9c1a1001"),
                    oid("671fd9e2a3b12c7f9c1a1002")
                ]
            },
            {
                _id: oid("671fd9e2a3b12c7f9c1a0013"),
                code: "CS-305",
                name: "Metodos Agiles de Desarrollo",
                days: ["Lunes", "Martes", "Miercoles", "Jueves", "viernes"],
                hours: "9:00 - 10:00",
                teacher: oid("671fd9e2a3b12c7f9c1a1004"), // Jose Luis
                students: [
                    oid("671fd9e2a3b12c7f9c1a1001"),
                    oid("671fd9e2a3b12c7f9c1a1002")
                ]
            }
        ];

        // 4. Insertar datos
        await UserModel.insertMany(users);
        await ClassModel.insertMany(classes);

        console.log('✅ Base de datos poblada correctamente.');

    } catch (error) {
        console.error('❌ Error en Seeder:', error);
    }
};

module.exports = seedDatabase;