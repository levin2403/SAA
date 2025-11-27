const express = require('express');
const cors = require('cors'); 
const connectDB = require('./src/config/db');
const userRouter = require('./src/router/user.router');
const classRouter = require('./src/router/class.router');
const seedDatabase = require('./src/utils/seeder');

connectDB().then(async () => {
    await seedDatabase();
    
    //app configuration
    const app = express();
    
    app.use(express.json()); 

    //routers declaration
    app.use('/', userRouter);
    app.use('/', classRouter);

    //server initialization
    app.listen(3000, () => {
      console.log('itson server is running on port 3000');
    });
}).catch(err => {
    console.error("Error connecting to Database:", err);
});





