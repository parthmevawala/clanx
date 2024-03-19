"use strict";

// Basic structure for express.
const express = require('express');
const config = require('../config.json');

const app = express();
const routes = require('./routes');
const services = require('./services');

// This call will initiate db connection
require('./database/mongo-connection')(app);

// Express compatibility for default JSON req / res.
app.use(express.json());
routes(app);
services(app);

// app listener
app.listen(config.PORT, () => {
    console.log(`Example app listening on port ${config.PORT}`);
});