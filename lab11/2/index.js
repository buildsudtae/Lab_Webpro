const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = 3000;

// ตั้งค่า Middleware และ View Engine
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ตั้งค่า Session
app.use(session({
    secret: 'restaurant-secret-key', // คีย์สำหรับเข้ารหัส Session
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 } // ตั้งเวลา Session 1 ชั่วโมง
}));

// ตัวแปรเก็บ URL ของ API
const API_URL = 'http://webdev.it.kmitl.ac.th:4000/restaurant';
const DETAIL_URL = 'http://webdev.it.kmitl.ac.th:4000/detail/';

// หน้าหลัก: ดึงข้อมูลเมนูอาหารทั้งหมดมาแสดง
app.get('/', async (req, res) => {
    try {
        const response = await fetch(API_URL);
        const foods = await response.json();
        res.render('menu', { foods: foods });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("ไม่สามารถดึงข้อมูลเมนูอาหารได้");
    }
});

// (A) เมื่อผู้ใช้เลือกรายการอาหาร ให้เก็บลง Session (ตะกร้าสินค้า)
app.get('/add-to-cart/:id', async (req, res) => {
    const productId = parseInt(req.params.id);
    
    // ถ้ายังไม่มีตะกร้า ให้สร้าง Array ว่างเตรียมไว้
    if (!req.session.cart) {
        req.session.cart = [];
    }

    try {
        // ดึงข้อมูลอาหารรายตัวจาก API ตาม id ที่ส่งมา
        const response = await fetch(DETAIL_URL + productId);
        const item = await response.json();

        // เช็คว่ามีอาหารชิ้นนี้ในตะกร้าหรือยัง
        let existingItem = req.session.cart.find(i => i.product_id === productId);
        
        if (existingItem) {
            existingItem.qty += 1; // ถ้ามีแล้วให้บวกจำนวน (Quantity) เพิ่ม
        } else {
            // ถ้ายังไม่มีให้ Push เป็นรายการใหม่
            req.session.cart.push({
                product_id: item.product_id,
                name: item.name,
                price: item.price,
                qty: 1
            });
        }
        // กลับไปที่หน้าหลักเพื่อให้เลือกอาหารต่อได้
        res.redirect('/');
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.redirect('/');
    }
});

// (B) หน้าตะกร้าสินค้า: แสดงรายการและคำนวณราคา
app.get('/cart', (req, res) => {
    const cart = req.session.cart || [];
    let totalPrice = 0;
    
    // คำนวณราคารวม
    cart.forEach(item => {
        totalPrice += item.price * item.qty;
    });

    res.render('cart', { cart: cart, totalPrice: totalPrice });
});

// (C) ยืนยันการสั่งซื้อ: ล้างข้อมูล Session ตะกร้าสินค้า
app.get('/confirm', (req, res) => {
    req.session.cart = []; // เคลียร์ Array ให้ว่างเปล่า
    res.redirect('/cart'); 
});

// เริ่มต้น Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});