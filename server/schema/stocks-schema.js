"use strict";

const { Schema, model } = require('mongoose');

const stockSchema = new Schema({
    regularMarketPrice: Number,
    symbol: String,
    shortName: String,
}, {
    timestamps: true
});

module.exports = model("stocks", stockSchema);