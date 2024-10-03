// Import các thư viện cần thiết
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

// Tạo ứng dụng Express
const app = express();
const PORT = process.env.PORT || 3000;

// Kết nối đến MongoDB
mongoose.connect('mongodb://localhost:27017/productDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

// Tạo mô hình Product
const productSchema = new mongoose.Schema({
    ProductCode: String,
    ProductName: String,
    ProductDate: Date,
    ProductOriginPrice: Number,
    Quantity: Number,
    ProductStoreCode: String,
});

const Product = mongoose.model('Product', productSchema);

// Cấu hình body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Cấu hình thư mục static cho EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Đường dẫn trang chủ để hiển thị sản phẩm
app.get('/', async (req, res) => {
    try {
        let sortOption = req.query.sort; // Lấy lựa chọn sắp xếp từ query params
        let sortCriteria = {};

        // Xác định tiêu chí sắp xếp dựa trên lựa chọn
        if (sortOption === 'storeCodeDesc') {
            sortCriteria = { ProductStoreCode: -1 }; // Giảm dần theo ProductStoreCode
        } else {
            sortCriteria = {}; // Mặc định không sắp xếp
        }

        const products = await Product.find().sort(sortCriteria); // Sắp xếp theo tiêu chí
        res.render('index', { products });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Đường dẫn để thêm sản phẩm
app.post('/add-product', async (req, res) => {
    const newProduct = new Product(req.body);
    try {
        await newProduct.save();
        res.redirect('/');
    } catch (err) {
        res.status(400).send('Error saving product');
    }
});

// Đường dẫn để xóa sản phẩm
app.post('/delete-product/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (err) {
        res.status(400).send('Error deleting product');
    }
});

// Đường dẫn để chỉnh sửa sản phẩm
app.get('/edit-product/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.render('edit', { product });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Đường dẫn để cập nhật sản phẩm
app.post('/update-product/:id', async (req, res) => {
    try {
        await Product.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/');
    } catch (err) {
        res.status(400).send('Error updating product');
    }
});

// Khởi động máy chủ
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
