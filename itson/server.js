const express = require('express');
const connectDB = require('./src/config/db');
const userRouter = require('./src/router/user.router');
const classRouter = require('./src/router/class.router');

// Importamos los modelos para poder hacer las inserciones
const User = require('./src/model/user.model');
const Class = require('./src/model/class.model');

connectDB().then(() => {
  // Ejecutar seed solo después de conectar a la BD
  seedDatabase();
});

// --- LÓGICA DE REINICIO DE DATOS---
const seedDatabase = async () => {
  try {
    console.log('--- Iniciando Reinicio de Datos ITSON ---');

    // 1. Borrar datos existentes
    await User.deleteMany({});
    await Class.deleteMany({});
    console.log('Datos anteriores eliminados (Users, Classes).');

    // 2. Insertar Clases (IDs fijos para relacionar con usuarios)
    const classesData = [
      {
        _id: "671fd9e2a3b12c7f9c1a0011",
        code: "MAT-301",
        name: "Arquitecturas empresariales",
        days: ["Martes", "Jueves"],
        hours: "13:00 - 14:30",
        teacher: "671fd9e2a3b12c7f9c1a1003",
        students: ["671fd9e2a3b12c7f9c1a1001", "671fd9e2a3b12c7f9c1a1002"]
      },
      {
        _id: "671fd9e2a3b12c7f9c1a0012",
        code: "CS-201",
        name: "Sistemas Distribuidos",
        days: ["Lunes", "Miercoles"],
        hours: "14:00 - 15:30",
        teacher: "671fd9e2a3b12c7f9c1a1004",
        students: ["671fd9e2a3b12c7f9c1a1001", "671fd9e2a3b12c7f9c1a1002"]
      },
      {
        _id: "671fd9e2a3b12c7f9c1a0013",
        code: "CS-305",
        name: "Metodos Agiles de Desarrollo",
        days: ["Lunes", "Martes", "Miercoles", "Jueves", "viernes"],
        hours: "9:00 - 10:00",
        teacher: "671fd9e2a3b12c7f9c1a1004",
        students: ["671fd9e2a3b12c7f9c1a1001", "671fd9e2a3b12c7f9c1a1002"]
      }
    ];

    await Class.insertMany(classesData);
    console.log('Clases insertadas correctamente.');

    // 3. Insertar Usuarios (Alumnos y Profesores)
    const usersData = [
      // Alumnos
      {
        _id: "671fd9e2a3b12c7f9c1a1001",
        id: "00000247527",
        password: "pass12345",
        name: "Jesus Gabriel Medina Leyva",
        rol: 'STUDENT',
        classes: ["671fd9e2a3b12c7f9c1a0011", "671fd9e2a3b12c7f9c1a0012", "671fd9e2a3b12c7f9c1a0013"]
      },
      {
        _id: "671fd9e2a3b12c7f9c1a1002",
        id: "00000240798",
        password: "pass12345",
        name: "Kevin Jared Sanchez Figueroa",
        rol: 'STUDENT',
        classes: ["671fd9e2a3b12c7f9c1a0011", "671fd9e2a3b12c7f9c1a0012", "671fd9e2a3b12c7f9c1a0013"]
      },
      // Profesores
      {
        _id: "671fd9e2a3b12c7f9c1a1003",
        id: "00000240474",
        password: "pass12345",
        name: "Dr. Gilberto Borrego Soto",
        rol: 'PROFESSOR',
        classes: ["671fd9e2a3b12c7f9c1a0011"]
      },
      {
        _id: "671fd9e2a3b12c7f9c1a1004",
        id: "00000250545",
        password: "pass12345",
        name: "Mtro. Jose Luis Robles Reyes",
        rol: 'PROFESSOR',
        classes: ["671fd9e2a3b12c7f9c1a0012", "671fd9e2a3b12c7f9c1a0013"]
      }
    ];

    await User.insertMany(usersData);
    console.log('Usuarios insertados correctamente.');
    console.log('--- Carga de datos ITSON finalizada ---');

  } catch (error) {
    console.error('Error en el seeder de ITSON:', error);
  }
};


const app = express();
app.use(express.json()); 


app.use('/', userRouter);
app.use('/', classRouter);

app.listen(3000, () => {
  console.log('itson server is running on port 3000');
});
