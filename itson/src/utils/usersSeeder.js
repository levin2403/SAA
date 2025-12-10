const mongoose = require('mongoose');
const UserModel = require('../model/user.model');

const oid = (id) => new mongoose.Types.ObjectId(id);

const seedUsers = async () => {
    try {
        // Verificamos que haya conexión antes de intentar nada
        if (mongoose.connection.readyState !== 1) return;

        console.log('Executing user sedeer...');

       
        await Promise.all([
            UserModel.deleteMany({}),
        ]);
        
        console.log('Colections cleaned.');

    
        const users = [
            // --- STUDENTS ---
            {
                _id: oid("671fd9e2a3b12c7f9c1a1001"),
                id: "00000247527",
                password: "pass12345",
                name: "Jesús Gabriel Medina Leyva",
                rol: 'STUDENT',
                classes: [
                    oid("671fd9e2a3b12c7f9c1a0011"),
                    oid("671fd9e2a3b12c7f9c1a0012"),
                    oid("671fd9e2a3b12c7f9c1a0013"),
                    oid("671fd9e2a3b12c7f9c1a0014"),
                    oid("671fd9e2a3b12c7f9c1a0015"),
                    oid("671fd9e2a3b12c7f9c1a0016"),
                    oid("671fd9e2a3b12c7f9c1a0017"),
                    oid("671fd9e2a3b12c7f9c1a0018"),
                    oid("671fd9e2a3b12c7f9c1a0019")
                ]
            },
            {
                _id: oid("671fd9e2a3b12c7f9c1a1002"),
                id: "00000240798",
                password: "pass12345",
                name: "Kevin Jared Sánchez Figueroa",
                rol: 'STUDENT',
                classes: [
                    oid("671fd9e2a3b12c7f9c1a0011"),
                    oid("671fd9e2a3b12c7f9c1a0012"),
                    oid("671fd9e2a3b12c7f9c1a0013"),
                    oid("671fd9e2a3b12c7f9c1a0014"),
                    oid("671fd9e2a3b12c7f9c1a0015"),
                    oid("671fd9e2a3b12c7f9c1a0016"),
                    oid("671fd9e2a3b12c7f9c1a0017"),
                    oid("671fd9e2a3b12c7f9c1a0018"),
                ]
            },
            {
                _id: oid("671fd9e2a3b12c7f9c1a1005"),
                id: "00000240001",
                password: "pass12345",
                name: "Carlos Damián García Bernal",
                rol: 'STUDENT',
                classes: [
                    oid("671fd9e2a3b12c7f9c1a0011"),
                    oid("671fd9e2a3b12c7f9c1a0012"),
                    oid("671fd9e2a3b12c7f9c1a0013"),
                    oid("671fd9e2a3b12c7f9c1a0014"),
                    oid("671fd9e2a3b12c7f9c1a0015"),
                    oid("671fd9e2a3b12c7f9c1a0016"),
                    oid("671fd9e2a3b12c7f9c1a0017"),
                    oid("671fd9e2a3b12c7f9c1a0018"),
                    oid("671fd9e2a3b12c7f9c1a0019")
                ]
            },
            {
                _id: oid("671fd9e2a3b12c7f9c1a1006"),
                id: "00000240002",
                password: "pass12345",
                name: "Saúl Armando Neri Escárcega",
                rol: 'STUDENT',
                classes: [
                    oid("671fd9e2a3b12c7f9c1a0011"),
                    oid("671fd9e2a3b12c7f9c1a0012"),
                    oid("671fd9e2a3b12c7f9c1a0013"),
                    oid("671fd9e2a3b12c7f9c1a0014"),
                    oid("671fd9e2a3b12c7f9c1a0015"),
                    oid("671fd9e2a3b12c7f9c1a0016"),
                    oid("671fd9e2a3b12c7f9c1a0017"),
                    oid("671fd9e2a3b12c7f9c1a0018"),
                    oid("671fd9e2a3b12c7f9c1a0019")
                ]
            },
            {
                _id: oid("671fd9e2a3b12c7f9c1a1007"),
                id: "00000240003",
                password: "pass12345",
                name: "Diana Sofía Bastidas Osuna",
                rol: 'STUDENT',
                classes: [
                    oid("671fd9e2a3b12c7f9c1a0011"),
                    oid("671fd9e2a3b12c7f9c1a0012"),
                    oid("671fd9e2a3b12c7f9c1a0013"),
                    oid("671fd9e2a3b12c7f9c1a0014"),
                    oid("671fd9e2a3b12c7f9c1a0015"),
                    oid("671fd9e2a3b12c7f9c1a0016"),
                    oid("671fd9e2a3b12c7f9c1a0017"),
                    oid("671fd9e2a3b12c7f9c1a0018"),
                    oid("671fd9e2a3b12c7f9c1a0019")
                ]
            },
            {
                _id: oid("671fd9e2a3b12c7f9c1a1008"),
                id: "00000240004",
                password: "pass12345",
                name: "Sebastián Murrieta Verduzco",
                rol: 'STUDENT',
                classes: [
                    oid("671fd9e2a3b12c7f9c1a0011"),
                    oid("671fd9e2a3b12c7f9c1a0012"),
                    oid("671fd9e2a3b12c7f9c1a0013"),
                    oid("671fd9e2a3b12c7f9c1a0014"),
                    oid("671fd9e2a3b12c7f9c1a0015"),
                    oid("671fd9e2a3b12c7f9c1a0016"),
                    oid("671fd9e2a3b12c7f9c1a0017"),
                    oid("671fd9e2a3b12c7f9c1a0018"),
                    oid("671fd9e2a3b12c7f9c1a0019")
                ]
            },
            {
                _id: oid("671fd9e2a3b12c7f9c1a1009"),
                id: "00000240005",
                password: "pass12345",
                name: "Wilber Valdez Quintero",
                rol: 'STUDENT',
                classes: [
                    oid("671fd9e2a3b12c7f9c1a0011"),
                    oid("671fd9e2a3b12c7f9c1a0012"),
                    oid("671fd9e2a3b12c7f9c1a0013"),
                    oid("671fd9e2a3b12c7f9c1a0014"),
                    oid("671fd9e2a3b12c7f9c1a0015"),
                    oid("671fd9e2a3b12c7f9c1a0016"),
                    oid("671fd9e2a3b12c7f9c1a0017"),
                    oid("671fd9e2a3b12c7f9c1a0018"),
                    oid("671fd9e2a3b12c7f9c1a0019")
                ]
            },
            {
                _id: oid("671fd9e2a3b12c7f9c1a1010"),
                id: "00000240006",
                password: "pass12345",
                name: "Luis Fernando Aguilar",
                rol: 'STUDENT',
                classes: [
                    oid("671fd9e2a3b12c7f9c1a0011"),
                    oid("671fd9e2a3b12c7f9c1a0012"),
                    oid("671fd9e2a3b12c7f9c1a0013"),
                    oid("671fd9e2a3b12c7f9c1a0014"),
                    oid("671fd9e2a3b12c7f9c1a0015"),
                    oid("671fd9e2a3b12c7f9c1a0016"),
                    oid("671fd9e2a3b12c7f9c1a0017"),
                    oid("671fd9e2a3b12c7f9c1a0018"),
                    oid("671fd9e2a3b12c7f9c1a0019")
                ]
            },
            {
                _id: oid("671fd9e2a3b12c7f9c1a1011"),
                id: "00000240007",
                password: "pass12345",
                name: "Héctor Andrés Lagarda Alcántar",
                rol: 'STUDENT',
                classes: [
                    oid("671fd9e2a3b12c7f9c1a0011"),
                    oid("671fd9e2a3b12c7f9c1a0012"),
                    oid("671fd9e2a3b12c7f9c1a0013"),
                    oid("671fd9e2a3b12c7f9c1a0014"),
                    oid("671fd9e2a3b12c7f9c1a0015"),
                    oid("671fd9e2a3b12c7f9c1a0016"),
                    oid("671fd9e2a3b12c7f9c1a0017"),
                    oid("671fd9e2a3b12c7f9c1a0018"),
                    oid("671fd9e2a3b12c7f9c1a0019")
                ]
            },
            {
                _id: oid("671fd9e2a3b12c7f9c1a1012"),
                id: "00000240008",
                password: "pass12345",
                name: "Ricardo Mendoza Paredes",
                rol: 'STUDENT',
                classes: [
                    oid("671fd9e2a3b12c7f9c1a0011"),
                    oid("671fd9e2a3b12c7f9c1a0012"),
                    oid("671fd9e2a3b12c7f9c1a0013"),
                    oid("671fd9e2a3b12c7f9c1a0014"),
                    oid("671fd9e2a3b12c7f9c1a0015"),
                    oid("671fd9e2a3b12c7f9c1a0016"),
                    oid("671fd9e2a3b12c7f9c1a0017"),
                    oid("671fd9e2a3b12c7f9c1a0018"),
                    oid("671fd9e2a3b12c7f9c1a0019")
                ]
            },

            // --- PROFESSORS ---
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
                name: "Mtro. José Luis Robles Reyes",
                rol: 'PROFESSOR',
                classes: [
                    oid("671fd9e2a3b12c7f9c1a0012"),
                    oid("671fd9e2a3b12c7f9c1a0013")
                ]
            },
            {
                _id: oid("671fd9e2a3b12c7f9c1a1015"),
                id: "00000250546",
                password: "pass12345",
                name: "Dra. Elsa Lorena Padilla Monge",
                rol: 'PROFESSOR',
                classes: [
                    oid("671fd9e2a3b12c7f9c1a0011")
                ]
            },
            {
                _id: oid("671fd9e2a3b12c7f9c1a1016"),
                id: "00000250547",
                password: "pass12345",
                name: "Mtro. Iván Tapia Moreno",
                rol: 'PROFESSOR',
                classes: [
                    oid("671fd9e2a3b12c7f9c1a0012")
                ]
            },
            {
                _id: oid("671fd9e2a3b12c7f9c1a1017"),
                id: "00000250548",
                password: "pass12345",
                name: "Mtro. Manuel Domitsu Kono",
                rol: 'PROFESSOR',
                classes: [
                    oid("671fd9e2a3b12c7f9c1a0013")
                ]
            },
            {
                _id: oid("671fd9e2a3b12c7f9c1a1018"),
                id: "00000250549",
                password: "pass12345",
                name: "Mtra. Alma Leticia Chávez Quintero",
                rol: 'PROFESSOR',
                classes: [
                    oid("671fd9e2a3b12c7f9c1a0011"),
                ]
            },
            {
                _id: oid("671fd9e2a3b12c7f9c1a1019"),
                id: "00000250550",
                password: "pass12345",
                name: "Mtro. Felipe Humberto Cabada Arisméndiz",
                rol: 'PROFESSOR',
                classes: [
                    oid("671fd9e2a3b12c7f9c1a0013")
                ]
            },
            {
                _id: oid("671fd9e2a3b12c7f9c1a1020"),
                id: "00000250551",
                password: "pass12345",
                name: "Mtra. Karla Monreal Sepúlveda",
                rol: 'PROFESSOR',
                classes: [
                    oid("671fd9e2a3b12c7f9c1a0012")
                ]
            }
        ];

        await UserModel.insertMany(users);

        console.log('Users populated correctly.');

    } catch (error) {
        console.error('An error ocurred while populating the users', error);
    }
};

module.exports = seedUsers;