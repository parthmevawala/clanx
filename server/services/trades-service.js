"use strict";
const mongoose = require('mongoose');

module.exports = (app) => {
    const TradesService = {};

    TradesService.findAll = async () => {
        // find all
        const trade = await app.models.Trades.find().populate('stockId');
        // Response
        return trade;
    };

    TradesService.fetchHoldings = async () => {
        const trade = await app.models.Trades.aggregate([
            // Calculate average price per unit for BUY trade types
            {
                $match: { tradeType: "BUY" }
            },
            // Lookup to retrieve symbol and shortName from stocks collection
            {
                $lookup: {
                    from: "stocks",
                    localField: "stockId",
                    foreignField: "_id",
                    as: "stock"
                }
            },
            {
                $unwind: "$stock"
            },
            {
                $group: {
                    _id: "$stock.symbol",
                    shortName: { $first: "$stock.shortName" },
                    averagePricePerUnit: { $avg: "$pricePerUnit" },
                    totalBuyQuantity: { $sum: "$quantity" }
                }
            },
            // Calculate total quantity for both BUY and SELL trade types
            {
                $lookup: {
                    from: "trades",
                    let: { symbol: "$_id" },
                    pipeline: [
                        {
                            $lookup: {
                                from: "stocks",
                                localField: "stockId",
                                foreignField: "_id",
                                as: "stock"
                            }
                        },
                        {
                            $unwind: "$stock"
                        },
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$stock.symbol", "$$symbol"] },
                                        { $in: ["$tradeType", ["SELL"]] }
                                    ]
                                }
                            }
                        },
                        {
                            $group: {
                                _id: "$tradeType",
                                totalQuantity: { $sum: "$quantity" }
                            }
                        }
                    ],
                    as: "sellQuantityInfo"
                }
            },
            {
                $project: {
                    _id: 1,
                    shortName: 1,
                    averagePricePerUnit: 1,
                    totalBuyQuantity: 1,
                    totalSellQuantity: { $arrayElemAt: ["$sellQuantityInfo.totalQuantity", 0] }
                }
            },
            {
                $project: {
                    _id: 1,
                    shortName: 1,
                    averagePricePerUnit: 1,
                    buySellQuantityDifference: { $subtract: ["$totalBuyQuantity", { $ifNull: ["$totalSellQuantity", 0] }] }
                }
            }
        ]);

        // Response
        return trade;
    }

    TradesService.fetchReturns = async () => {
        const trade = await app.models.Trades.aggregate([
            // Lookup to retrieve symbol and shortName from stocks collection
            {
                $lookup: {
                    from: "stocks",
                    localField: "stockId",
                    foreignField: "_id",
                    as: "stock"
                }
            },
            // Unwind the stock array
            { $unwind: "$stock" },
            // Project to calculate total investment and total return for each trade
            {
                $project: {
                    symbol: "$stock.symbol",
                    shortName: "$stock.shortName",
                    tradeType: 1,
                    quantity: 1,
                    pricePerUnit: 1,
                    totalInvestment: { $multiply: ["$quantity", "$pricePerUnit"] },
                    totalReturn: {
                        $cond: {
                            if: { $eq: ["$tradeType", "BUY"] },
                            then: { $multiply: ["$quantity", 100] }, // Final price assumed as 100
                            else: { $multiply: ["$quantity", "$pricePerUnit"] }
                        }
                    }
                }
            },
            // Group by symbol and calculate cumulative returns
            {
                $group: {
                    _id: "$symbol",
                    shortName: { $first: "$shortName" },
                    totalInvestment: { $sum: "$totalInvestment" },
                    totalReturn: { $sum: "$totalReturn" }
                }
            },
            // Project to calculate cumulative returns
            {
                $project: {
                    _id: 1,
                    shortName: 1,
                    totalInvestment: 1,
                    totalReturn: 1,
                    cumulativeReturns: { $subtract: ["$totalReturn", "$totalInvestment"] }
                }
            }
        ]);

        // Response
        return trade;
    };

    TradesService.addTrade = async ({ stockId, quantity, pricePerUnit, tradeDate, tradeType }) => {
        // Validations
        if (!stockId || !mongoose.isValidObjectId(stockId)) {
            throw new Error('Stock id is invalid!');
        }
        const stock = await app.models.Stocks.findById(stockId.toString());
        if (!stock) {
            throw new Error('Stock not found!');
        }
        if (!quantity || quantity.constructor !== Number) {
            throw new Error('Invalid quantity!');
        }
        if (!pricePerUnit || pricePerUnit.constructor !== Number) {
            throw new Error('Invalid Price per unit!');
        }
        if (!tradeDate || isNaN(new Date(tradeDate).getTime()) || new Date(tradeDate).getTime() > new Date().getTime()) {
            throw new Error('Invalid Trade Date!');
        }
        if (!['BUY', 'SELL'].includes(tradeType)) {
            throw new Error('Invalid Trade Type!');
        }
        // Insert
        const trade = await app.models.Trades.create({ stockId, quantity, pricePerUnit, tradeDate, tradeType });
        // Response
        return trade;
    };

    TradesService.updateTrade = async ({ id, stockId, quantity, pricePerUnit, tradeDate, tradeType }) => {
        const setObject = {};
        // Validations
        if (!id || !mongoose.isValidObjectId(id)) {
            throw new Error('Trade id is invalid!');
        }

        if (stockId) {
            if (!mongoose.isValidObjectId(stockId)) {
                throw new Error('Stock id is invalid!');
            }
            const stock = await app.models.Stocks.findById(stockId.toString());
            if (!stock) {
                throw new Error('Stock not found!');
            }
            setObject.stockId = stockId;
        }

        if (quantity) {
            if (quantity.constructor !== Number || quantity <= 0) {
                throw new Error('Invalid quantity!');
            }
            setObject.quantity = quantity;
        }

        if (pricePerUnit) {
            if (pricePerUnit.constructor !== Number || pricePerUnit <= 0) {
                throw new Error('Invalid Price per unit!');
            }
            setObject.pricePerUnit = pricePerUnit;
        }

        if (tradeDate) {
            if (isNaN(new Date(tradeDate).getTime()) || new Date(tradeDate).getTime() > new Date().getTime()) {
                throw new Error('Invalid Trade Date!');
            }
            setObject.tradeDate = tradeDate;
        }

        if (tradeType) {
            if (!['BUY', 'SELL'].includes(tradeType)) {
                throw new Error('Invalid Trade Type!');
            }
            setObject.tradeType = tradeType;
        }

        // Update
        const trade = await app.models.Trades.findByIdAndUpdate({ _id: id },
            { $set: setObject },
            { new: true });
        // Response
        return trade;
    };

    TradesService.removeTrade = async ({ id }) => {
        // Validations
        if (!id || !mongoose.isValidObjectId(id)) {
            throw new Error('Trade id is invalid!');
        }

        // Delete
        const trade = await app.models.Trades.findByIdAndDelete(id);
        // Response
        return trade;
    };
    return TradesService;
}