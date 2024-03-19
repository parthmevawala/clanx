"use strict";

module.exports = (app) => {
    app.services = {
        TradesService: require('./trades-service')(app)
    };
    return null;
}