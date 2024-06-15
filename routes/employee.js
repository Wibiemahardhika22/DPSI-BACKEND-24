const express = require('express');
const router = express.Router();
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
        const employee = await Employee.findAll();
        res.json(employee);
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