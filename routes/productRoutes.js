// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all products
router.get('/', async (req, res) => {
    const products = await Product.find().sort({ ProductStoreCode: -1 });
    res.render('index', { products });
});

// Insert a new product
router.post('/', async (req, res) => {
    const { ProductCode, ProductName, ProductDate, ProductOriginPrice, Quantity, ProductStoreCode } = req.body;
    await Product.create({
        ProductCode,
        ProductName,
        ProductDate,
        ProductOriginPrice,
        Quantity,
        ProductStoreCode
    });
    res.redirect('/products');
});

// Delete a product
router.delete('/:id', async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/products');
});

module.exports = router;
