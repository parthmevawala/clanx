"use strict";

const { Schema, model, Types } = require('mongoose');

const tradeSchema = new Schema({
    tradeType: {
        type: String,
        enum: ['BUY', 'SELL'],
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    pricePerUnit: {
        type: Number,
        required: true
    },
    tradeDate: {
        type: Date,
        required: true
    },
    stockId: {
        type: Types.ObjectId,
        ref: 'stocks',
        required: true
    }
}, {
    timestamps: true
});

module.exports = model("trades", tradeSchema);