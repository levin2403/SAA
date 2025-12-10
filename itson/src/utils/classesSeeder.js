const mongoose = require('mongoose');
const UserModel = require('../model/user.model');
const ClassModel = require('../model/class.model');

const oid = (id) => new mongoose.Types.ObjectId(id);

const seedClasses = async () => {
    try {
        if (mongoose.connection.readyState !== 1) return;

        console.log('Executing classes sedeer...');

        await Promise.all([
            ClassModel.deleteMany({})
        ]);
        
        console.log('Colections cleaned.');

        const allStudents = [
            oid("671fd9e2a3b12c7f9c1a1001"),
            oid("671fd9e2a3b12c7f9c1a1002"),
            oid("671fd9e2a3b12c7f9c1a1005"),
            oid("671fd9e2a3b12c7f9c1a1006"),
            oid("671fd9e2a3b12c7f9c1a1007"),
            oid("671fd9e2a3b12c7f9c1a1008"),
            oid("671fd9e2a3b12c7f9c1a1009"),
            oid("671fd9e2a3b12c7f9c1a1010"),
            oid("671fd9e2a3b12c7f9c1a1011"),
            oid("671fd9e2a3b12c7f9c1a1012")
        ];

        const classes = [
            {
                _id: oid("671fd9e2a3b12c7f9c1a0011"),
                code: "MAT-301",
                classroom: "LV-1821",
                name: "Arquitecturas Empresariales",
                days: ["Martes", "Jueves"],
                hours: "13:00 - 14:30",
                teacher: oid("671fd9e2a3b12c7f9c1a1003"), // Gilberto
                students: allStudents
            },
            {
                _id: oid("671fd9e2a3b12c7f9c1a0012"),
                code: "CS-201",
                classroom: "LV-1822",
                name: "Sistemas Distribuidos",
                days: ["Lunes", "Miércoles"],
                hours: "14:00 - 15:30",
                teacher: oid("671fd9e2a3b12c7f9c1a1004"), // Jose Luis
                students: allStudents
            },
            {
                _id: oid("671fd9e2a3b12c7f9c1a0013"),
                code: "CS-305",
                classroom: "LV-1833",
                name: "Métodos Ágiles de Desarrollo",
                days: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
                hours: "9:00 - 10:00",
                teacher: oid("671fd9e2a3b12c7f9c1a1004"), // Jose Luis
                students: allStudents
            },
            {
                _id: oid("671fd9e2a3b12c7f9c1a0014"),
                code: "CS-320",
                classroom: "LV-1828",
                name: "Administración de Proyectos",
                days: ["Lunes", "Miércoles"],
                hours: "10:00 - 11:30",
                teacher: oid("671fd9e2a3b12c7f9c1a1015"), // Elsa
                students: allStudents
            },
            {
                _id: oid("671fd9e2a3b12c7f9c1a0015"),
                code: "CS-330",
                classroom: "LV-1835",
                name: "Proyecto de Software Integrador",
                days: ["Martes", "Jueves"],
                hours: "11:00 - 12:30",
                teacher: oid("671fd9e2a3b12c7f9c1a1016"), // Ivan
                students: allStudents
            },
            {
                _id: oid("671fd9e2a3b12c7f9c1a0016"),
                code: "CS-340",
                classroom: "LV-1827",
                name: "Métodos Numéricos Computacionales",
                days: ["Lunes", "Miércoles", "Viernes"],
                hours: "12:00 - 13:30",
                teacher: oid("671fd9e2a3b12c7f9c1a1017"), // Manuel
                students: allStudents
            },
            {
                _id: oid("671fd9e2a3b12c7f9c1a0017"),
                code: "CS-350",
                classroom: "LV-1837",
                name: "Implementación de Prototipos",
                days: ["Lunes", "Miércoles"],
                hours: "15:00 - 16:30",
                teacher: oid("671fd9e2a3b12c7f9c1a1018"), // Alma
                students: allStudents
            },
            {
                _id: oid("671fd9e2a3b12c7f9c1a0018"),
                code: "CS-360",
                classroom: "LV-1822",
                name: "Sistemas Operativos",
                days: ["Martes", "Jueves"],
                hours: "08:00 - 09:30",
                teacher: oid("671fd9e2a3b12c7f9c1a1019"), // Felipe
                students: allStudents
            },
            {
                _id: oid("671fd9e2a3b12c7f9c1a0019"),
                code: "CS-370",
                classroom: "LV-1821",
                name: "Programación 2",
                days: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
                hours: "16:00 - 17:30",
                teacher: oid("671fd9e2a3b12c7f9c1a1020"), // Karla
                students: allStudents
            }
        ];

        await ClassModel.insertMany(classes);

        console.log('Classes populated correctly.');

    } catch (error) {
        console.error('An error ocurred while populating the classes', error);
    }
};

module.exports = seedClasses;