const express = require('express');
const { Op } = require('sequelize');
const router = express.Router();
const Customer = require('../models/customer');

router.post('/', async (req, res, next) => {
    try {
        const { customerName, contactName, address, city, postalCode, country } = req.body;
        const newCustomer = await Customer.create({
            customerName,
            contactName,
            address,
            city,
            postalCode,
            country
        });
        res.status(201).json(newCustomer);
    } catch (err) {
        next(err);
    }
});

router.get('/', async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 0;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";
        const offset = page * limit;

        const whereClause = {
            [Op.or]: [{
                customerName: {
                    [Op.like]: '%' + search + '%'
                }
            }, {
                contactName: {
                    [Op.like]: '%' + search + '%'
                }
            }]
        };

        const totalRows = await Customer.count({ where: whereClause });
        const totalPages = Math.ceil(totalRows / limit);

        if (totalRows === 0) {
            return res.json({
                message: 'Tidak ada data',
            });
        }

        const result = await Customer.findAll({
            where: whereClause,
            offset: offset,
            limit: limit,
            order: [['customerID', 'DESC']]
        });

        res.json({
            page,
            limit,
            totalRows,
            totalPages,
            result,
        });
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const customer = await Customer.findByPk(req.params.id);
        if (customer) {
            res.json(customer);
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (err) {
        next(err);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const customer = await Customer.update(req.body, {
            where: { customerID: req.params.id }
        });

        if (customer) {
            const customerUpdated = await Customer.findByPk(req.params.id);
            res.json(customerUpdated);
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const customer = await Customer.findByPk(req.params.id);
        if (customer) {
            await customer.destroy();
            res.json({ message: 'Customer deleted' });
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (err) {
        next(err);
    }
});

module.exports = router;