const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Employee = require('../models/employee');

router.post('/', async (req, res, next) => {
    try {
        const { firstName, lastName, birthDate, photo, notes } = req.body;
        const newEmployee = await Employee.create({
            firstName, lastName, birthDate, photo, notes
        });
        res.status(201).json(newEmployee);
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
                firstName: {
                    [Op.like]: '%' + search + '%'
                }
            }, {
                lastName: {
                    [Op.like]: '%' + search + '%'
                }
            }]
        };

        const totalRows = await Employee.count({ where: whereClause });
        const totalPages = Math.ceil(totalRows / limit);

        if (totalRows === 0) {
            return res.json({
                message: 'Tidak ada data',
            });
        }

        const result = await Employee.findAll({
            where: whereClause,
            offset: offset,
            limit: limit,
            order: [['employeeID', 'DESC']]
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
        const employee = await Employee.findByPk(req.params.id);
        if (employee) {
            res.json(employee);
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (err) {
        next(err);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const employee = await Employee.update(req.body, {
            where: { employeeID: req.params.id }
        });

        if (employee) {
            const employeeUpdated = await Employee.findByPk(req.params.id);
            res.json(employeeUpdated);
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const employee = await Employee.findByPk(req.params.id);
        if (employee) {
            await employee.destroy();
            res.json({ message: 'Employee deleted' });
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (err) {
        next(err);
    }
});

module.exports = router;