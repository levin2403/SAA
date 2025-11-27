const express = require('express');
const cors = require('cors'); 
const connectDB = require('./src/config/db');

// Importar Routers
const sessionRouter = require('./src/routers/session.router');
const classSessionRouter = require('./src/routers/classSession.router');
const seedClassSessions = require('./src/utils/seeder'); 

require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/', sessionRouter);
app.use('/', classSessionRouter);

// --- CONEXIÓN Y SEED ---
connectDB().then(async () => {
    
    // 2. EJECUTAR SEEDER AL INICIO
    await seedClassSessions();

    app.listen(PORT, () => {
        console.log(`Attendance Server running on port ${PORT}`);
    });

}).catch(err => {
    console.error("Error connecting to Database:", err);
});