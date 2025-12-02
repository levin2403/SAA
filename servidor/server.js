const express = require('express');
const cors = require('cors'); 
const connectDB = require('./src/config/db');
const outhRouter = require('./src/routers/session.router');
const usersRouter = require('./src/routers/user.routes');
const getClassSessionRouter = require('./src/routers/classSession.router');
const seedSessions = require('./src/utils/seeder'); 

require('dotenv').config();

const app = express();
const PORT = process.env.PORT; 

// Middlewares
app.use(cors());
app.use(express.json());

// Protected routes
app.use('/', outhRouter);
app.use('/', usersRouter);
app.use('/', getClassSessionRouter);

connectDB().then(async () => {
    
    await seedSessions();

    app.listen(PORT, () => {
        console.log(`Attendance Server running on port ${PORT}`);
    });

}).catch(err => {
    console.error("Error connecting to Database:", err);
});