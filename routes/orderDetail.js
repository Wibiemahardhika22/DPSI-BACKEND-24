const express = require('express');
const router = express.Router();
const OrderDetail = require('../models/orderDetail');

router.post('/', async (req, res, next) => {
    try {
        const { orderID, productID, quantity } = req.body;
        const newOrderDetail = await OrderDetail.create({
            orderID, productID, quantity
        });
        res.status(201).json(newOrderDetail);
    } catch (err) {
        next(err);
    }
});

router.get('/', async (req, res, next) => {
    try {
        const orderDetail = await OrderDetail.findAll();
        res.json(orderDetail);
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const orderDetail = await OrderDetail.findByPk(req.params.id);
        if (orderDetail) {
            res.json(orderDetail);
        } else {
            res.status(404).json({ message: 'Order Detail not found' });
        }
    } catch (err) {
        next(err);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const orderDetail = await OrderDetail.update(req.body, {
            where: { orderDetailID: req.params.id }
        });

        if (orderDetail) {
            const orderDetailUpdated = await OrderDetail.findByPk(req.params.id);
            res.json(orderDetailUpdated);
        } else {
            res.status(404).json({ message: 'Order Detail not found' });
        }
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const orderDetail = await OrderDetail.findByPk(req.params.id);
        if (orderDetail) {
            await orderDetail.destroy();
            res.json({ message: 'Order Detail deleted' });
        } else {
            res.status(404).json({ message: 'Order Detail not found' });
        }
    } catch (err) {
        next(err);
    }
});

module.exports = router;