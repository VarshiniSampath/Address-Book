require('babel-register');
const mongoose = require('mongoose');

const MONGODB = process.env.MONGO || "mongodb://localhost:27017/publications";

mongoose.connect(MONGODB, { useMongoClient: true }, () => {
  console.log('MongoDB conencted at ${MONGODB}');
});


const express = require('express');
const server = express();

// All URL resolving is handled in controllers/routes.js file
require('./controllers/routes.js')(server);

// Creates a server running on port 3000.
server.listen(4000);
