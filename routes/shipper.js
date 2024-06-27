const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Shipper = require('../models/shipper');

router.post('/', async (req, res, next) => {
    try {
        const { shipperName, phone } = req.body;
        const newShipper = await Shipper.create({
            shipperName, phone
        });
        res.status(201).json(newShipper);
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
                shipperName: {
                    [Op.like]: '%' + search + '%'
                }
            }]
        };

        const totalRows = await Shipper.count({ where: whereClause });
        const totalPages = Math.ceil(totalRows / limit);

        if (totalRows === 0) {
            return res.json({
                message: 'Tidak ada data',
            });
        }

        const result = await Shipper.findAll({
            where: whereClause,
            offset: offset,
            limit: limit,
            order: [['shipperID', 'DESC']]
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
        const shipper = await Shipper.findByPk(req.params.id);
        if (shipper) {
            res.json(shipper);
        } else {
            res.status(404).json({ message: 'Shipper not found' });
        }
    } catch (err) {
        next(err);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const shipper = await Shipper.update(req.body, {
            where: { shipperID: req.params.id }
        });

        if (shipper) {
            const shipperUpdated = await Shipper.findByPk(req.params.id);
            res.json(shipperUpdated);
        } else {
            res.status(404).json({ message: 'Shipper not found' });
        }
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const shipper = await Shipper.findByPk(req.params.id);
        if (shipper) {
            await shipper.destroy();
            res.json({ message: 'Shipper deleted' });
        } else {
            res.status(404).json({ message: 'Shipper not found' });
        }
    } catch (err) {
        next(err);
    }
});

module.exports = router;