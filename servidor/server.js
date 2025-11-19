const express = require('express');
const connectDB = require('./src/config/db');  
const outhRouter = require('./src/routers/auth.router');
const usersRouter = require('./src/routers/user.routes');
const getClassSessionRouter = require('./src/routers/classSession.router');

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

connectDB(); //dattabase connection

// Protected routes
app.use('/', outhRouter);
app.use('/', usersRouter);
app.use('/', getClassSessionRouter);

// Start the server
app.listen(3001, () => {
  console.log('server is running on port 3001');
});