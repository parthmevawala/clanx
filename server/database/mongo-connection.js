"use strict";

const mongoose = require('mongoose');
const { MONGO_DB } = require('../../config.json');

module.exports = async (app) => {
    // connecting to db
    await mongoose.connect(MONGO_DB.URL, { dbName: MONGO_DB.DATABASE });
    console.log('Connected successfully to server');
    // saving models in app object
    const models = require('../schema');
    if (app) {
        app.models = models;
    }
    // connection emit to handle after-connect codes.
    process.emit('onMongooseConnect');
    return null;
};