const express = require('express');
const connectDB = require('./src/config/db');  
const outhRouter = require('./src/routers/session.router');
const usersRouter = require('./src/routers/user.routes');
const getClassSessionRouter = require('./src/routers/classSession.router');

// Importar Modelo de Sesión para el Seeder
const Session = require('./src/models/session.model');

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

// Database connection y ejecución del Seeder
connectDB().then(() => {
  seedSessions();
});

// --- LÓGICA DE REINICIO DE SESIONES--
const seedSessions = async () => {
  try {
    console.log('--- Iniciando Reinicio de Sesiones (Servidor Principal) ---');

    // 1. Borrar sesiones anteriores
    await Session.deleteMany({});
    console.log('Sesiones anteriores eliminadas.');

    // 2. Insertar nuevas sesiones 
    const sessionData = [
      {
        userId: "00000247527",  
        tokenVersion: 0,
        lastConnection: new Date(),
        refreshTokens: []
      },
      {
        userId: "00000240798",  
        tokenVersion: 0,
        lastConnection: new Date(),
        refreshTokens: []
      },
      {
        userId: "00000240474",  
        tokenVersion: 0,
        lastConnection: new Date(),
        refreshTokens: []
      },
      {
        userId: "00000250545",  
        tokenVersion: 0,
        lastConnection: new Date(),
        refreshTokens: []
      }
    ];

    await Session.insertMany(sessionData);
    console.log('Nuevas sesiones insertadas correctamente.');
    console.log('--- Carga de datos Servidor Principal finalizada ---');

  } catch (error) {
    console.error('Error al insertar sesiones:', error);
  }
};

app.use('/', outhRouter);
app.use('/', usersRouter);
app.use('/', getClassSessionRouter);


app.listen(3001, () => {
  console.log('server is running on port 3001');
});