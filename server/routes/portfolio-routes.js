"use strict";

const { Router } = require('express');
const portfolioRoutes = Router();

module.exports = (app) => {
    const { models } = app;

    // All portfolio routes go below
    portfolioRoutes.get('/', async (req, res) => {
        try {
            const data = await app.services.TradesService.findAll();
            res.status(200).send({
                success: true,
                data
            });
        } catch (error) {
            res.status(400).send({
                success: false,
                errorL: error.message || error
            });
        }
    });

    portfolioRoutes.get('/holdings', async (req, res) => {
        try {
            const data = await app.services.TradesService.fetchHoldings();
            res.status(200).send({
                success: true,
                data
            });
        } catch (error) {
            res.status(400).send({
                success: false,
                errorL: error.message || error
            });
        }
    });

    portfolioRoutes.get('/returns', async (req, res) => {
        try {
            const data = await app.services.TradesService.fetchReturns();
            res.status(200).send({
                success: true,
                data
            });
        } catch (error) {
            res.status(400).send({
                success: false,
                errorL: error.message || error
            });
        }
    });

    portfolioRoutes.post('/add-trade', async (req, res) => {
        try {
            const { stockId, quantity, pricePerUnit, tradeDate, tradeType } = req.body;
            const data = await app.services.TradesService.addTrade({ stockId, quantity, pricePerUnit, tradeDate, tradeType });
            res.status(201).send({
                success: true,
                data
            });
        } catch (error) {
            res.status(400).send({
                success: false,
                errorL: error.message || error
            });
        }
    });

    portfolioRoutes.post('/:id/update-trade', async (req, res) => {
        try {
            const { id } = req.params;
            const { stockId, quantity, pricePerUnit, tradeDate, tradeType } = req.body;
            const data = await app.services.TradesService.updateTrade({ id, stockId, quantity, pricePerUnit, tradeDate, tradeType });
            res.status(200).send({
                success: true,
                data
            });
        } catch (error) {
            res.status(400).send({
                success: false,
                errorL: error.message || error
            });
        }
    });

    portfolioRoutes.post('/:id/remove-trade', async (req, res) => {
        try {
            const { id } = req.params;
            const data = await app.services.TradesService.removeTrade({ id });
            res.status(200).send({
                success: true,
                data
            });
        } catch (error) {
            res.status(400).send({
                success: false,
                errorL: error.message || error
            });
        }
    });

    return portfolioRoutes;
};