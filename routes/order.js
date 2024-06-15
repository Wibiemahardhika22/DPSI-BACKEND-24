const express = require('express');
const router = express.Router();
const Order = require('../models/order');

router.post('/', async (req, res, next) => {
    try {
        const { customerID, firstName, employeeID, orderDate, shipperID } = req.body;
        const newOrder = await Order.create({
            customerID, firstName, employeeID, orderDate, shipperID
        });
        res.status(201).json(newOrder);
    } catch (err) {
        next(err);
    }
});

router.get('/', async (req, res, next) => {
    try {
        const order = await Order.findAll();
        res.json(order);
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const order = await Order.findByPk(req.params.id);
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (err) {
        next(err);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const order = await Order.update(req.body, {
            where: { orderID: req.params.id }
        });

        if (order) {
            const orderUpdated = await Order.findByPk(req.params.id);
            res.json(orderUpdated);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const order = await Order.findByPk(req.params.id);
        if (order) {
            await order.destroy();
            res.json({ message: 'Order deleted' });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (err) {
        next(err);
    }
});

module.exports = router;