"use strict";

const { Schema, model } = require('mongoose');

const stockSchema = new Schema({
    regularMarketPrice: {
        type: Number,
        required: true
    },
    symbol: {
        type: String,
        required: true
    },
    shortName: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = model("stocks", stockSchema);