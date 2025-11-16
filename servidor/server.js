const express = require('express');
const usersRouter = require('./src/routers/user.routes');
const connectDB = require('./src/config/db');  

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

connectDB(); //dattabase connection

// Protected routes
app.use('/', usersRouter);

// Start the server
app.listen(3001, () => {
  console.log('Gateway server is running on port 3001');
});