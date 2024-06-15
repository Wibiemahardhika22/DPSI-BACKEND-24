const express = require('express');
const router = express.Router();
const Supplier = require('../models/supplier');

router.post('/', async (req, res, next) => {
    try {
        const { supplierName, contactName, address, city, postalCode, country, phone } = req.body;
        const newSupplier = await Supplier.create({
            supplierName, contactName, address, city, postalCode, country, phone
        });
        res.status(201).json(newSupplier);
    } catch (err) {
        next(err);
    }
});

router.get('/', async (req, res, next) => {
    try {
        const supplier = await Supplier.findAll();
        res.json(supplier);
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const supplier = await Supplier.findByPk(req.params.id);
        if (supplier) {
            res.json(supplier);
        } else {
            res.status(404).json({ message: 'Supplier not found' });
        }
    } catch (err) {
        next(err);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const supplier = await Supplier.update(req.body, {
            where: { supplierID: req.params.id }
        });

        if (supplier) {
            const supplierUpdated = await Supplier.findByPk(req.params.id);
            res.json(supplierUpdated);
        } else {
            res.status(404).json({ message: 'Supplier not found' });
        }
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const supplier = await Supplier.findByPk(req.params.id);
        if (supplier) {
            await supplier.destroy();
            res.json({ message: 'Supplier deleted' });
        } else {
            res.status(404).json({ message: 'Supplier not found' });
        }
    } catch (err) {
        next(err);
    }
});

module.exports = router;