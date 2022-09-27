// Our main server entry point
// (install nodemon for live changes)
const express = require('express');
const path = require('path'); // core module
const bodyParser = require('body-parser');   
const cors = require('cors'); // allow access from any domain name
const passport =  require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

// connecting to our DB
mongoose.connect(config.database);

// on connection
mongoose.connection.on('connected', () => {
    console.log(`Connected to database ${config.database}`);
    
});

const app = express(); // initialize app variable with express

// user routes gotten from the routes folder
const users = require('./routes/users');

// Port Number
const port = 3000;

// CORS Middleware
app.use(cors());

// Set Static Folder (linking to client side folder)
// it will load the index.html in the 'public folder' as it's root content 
app.use(express.static(path.join(__dirname, 'public'))); 

// Body Parser Middleware
app.use(bodyParser.json());

app.use('/users', users); // localhost:3000/users/xxxx

// Index Route
app.get('/', (req, res) => {
    res.send('Invalid Endpoint');
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});