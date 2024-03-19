"use strict";

require('../database/mongo-connection')();
const yahooFinance = require('yahoo-finance2').default;
let models;

// These are the stock lists to be updated
const stocks = require('../../config.json').BASIC_DATA.STOCKS;

// Following code upserts the stocks
const upsertStock = async (symbol) => {
    // Fetching data from yahoo finance, which will directly get updated in the db.
    const stock = await yahooFinance.quote(symbol);
    if (!stock) {
        console.log(`Invalid stock symbol: ${stock}`);
        return null;
    }
    await models.Stocks.updateOne({ symbol }, {
        $set: stock
    }, { upsert: true });
};

// Following method will execute all assembled queries. Its like main method in this file.
const executeQueries = async () => {
    models = require('../schema');
    let taskTexting = 'updating';
    let taskTexted = 'updated';

    if (process.argv.includes('--truncate')) {
        console.log('truncating stocks...');
        await models.Stocks.deleteMany();
        console.log('stocks truncated.');
        taskTexting = 'creating';
        taskTexted = 'created';
    }
    console.log(`${taskTexting} stocks...`);
    for (const stock of stocks) {
        await upsertStock(stock);
    }
    console.log(`stocks ${taskTexted} successfully.`);
    console.log(`data ${taskTexted} successfully.`);
    process.exit(0);
};

// This is an event listener. Its executed when connection is created.
process.on('onMongooseConnect', executeQueries);