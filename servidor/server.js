const express = require('express');
const connectDB = require('./src/config/db');
const outhRouter = require('./src/routers/session.router');
const usersRouter = require('./src/routers/user.routes');
const getClassSessionRouter = require('./src/routers/classSession.router');

const app = express();
app.use(express.json()); // Middleware for JSON

connectDB(); //dattabase connection

// CORS configuration
app.use(require('cors')({
  origin: '*',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}));

// Protected routes
app.use('/', outhRouter);
app.use('/', usersRouter);
app.use('/', getClassSessionRouter);


// Start the server
app.listen(3001, () => {
  console.log('server is running on port 3001');
});