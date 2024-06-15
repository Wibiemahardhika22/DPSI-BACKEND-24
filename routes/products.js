const express = require('express');
const router = express.Router();
const Product = require('../models/product'); // Impor model Product
const { authenticate, authorize } = require('../middleware/auth');

// Endpoint untuk menambahkan produk baru
router.post('/', authenticate, authorize(['admin']), async (req, res, next) => {
    try {
        const { productName, supplierID, categoryID, unit, price } = req.body;
        const newProduct = await Product.create({
            productName, supplierID,
            categoryID, unit, price
        });
        res.status(201).json(newProduct);
    } catch (err) {
        next(err);
    }
});

// Endpoint untuk menampilkan semua produk
router.get('/', authenticate, async (req, res, next) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (err) {
        next(err);
    }
});

// Endpoint untuk menampilkan produk berdasarkan ID
router.get('/:id', authenticate, async (req, res, next) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (err) {
        next(err);
    }
});

// Endpoint untuk memperbarui produk berdasarkan ID
router.put('/:id', authenticate, authorize(['admin']), async (req, res, next) => {
    try {
        const product = await Product.update(req.body, {
            where: { productID: req.params.id }
        });

        if (product) {
            const productUpdated = await Product.findByPk(req.params.id);
            res.json(productUpdated);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        next(error);
    }
});

// Endpoint untuk menghapus produk berdasarkan ID
router.delete('/:id', authenticate, authorize(['admin']), async (req, res, next) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (product) {
            await product.destroy();
            res.json({ message: 'Product deleted' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (err) {
        next(err);
    }
});

module.exports = router;