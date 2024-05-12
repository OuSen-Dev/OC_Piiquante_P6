// All Const needed ----------------------------------
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const helmet = require('helmet');
const path = require('path');

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

require('dotenv').config({ path: "./config/.env"});
require('./config/mgdb');

app.use(helmet());


// CORS Management -----------------------------------
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS, PATCH"
    );
    next();
  });

// Express app creation ------
app.use(express.json());


// All ROUTES --------------------
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

// Export ------------------------
module.exports = app;


