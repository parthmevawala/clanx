"use strict";

const { Schema, model, Types } = require('mongoose');

const tradeSchema = new Schema({
    tradeType: {
        type: String,
        enum: ['BUY', 'SELL'],
        required: true
    },
    quantity: Number,
    pricePerUnit: Number,
    tradeDate: Date,
    stockId: {
        type: Types.ObjectId,
        ref: 'stocks',
        required: true
    }
}, {
    timestamps: true
});

module.exports = model("trades", tradeSchema);