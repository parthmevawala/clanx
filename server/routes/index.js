"use strict";

// This place manages all the routes
module.exports = app => {
    const portfolioRoutes = require('./portfolio-routes')(app);
    app.use('/portfolio', portfolioRoutes);
}