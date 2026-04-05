const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const path = require('path');
// ไม่ได้ใช้ sqlite3 ในรอบนี้ (เพราะดึง API) แต่ปล่อยไว้ได้ครับเผื่อใช้ในอนาคต
const sqlite3 = require('sqlite3').verbose(); 

const app = express();
const PORT = 3000;

// ================= Middleware Setup =================
app.use(cookieParser());
app.use(session({
    secret: 'your-secret-key-for-your-store',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 10 * 60000 * 60 } // Session หมดอายุ
}));

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

// ================= Routes =================

// 1. หน้าเมนูหลัก (ดึงข้อมูลจาก API)
app.get('/', (req, res) => {
    const endpoint = 'http://10.110.194.140:8000/menu';

    fetch(endpoint)
    .then((respon) => respon.json())
    .then((data) => {
        // นับจำนวนของในตะกร้าเพื่อส่งไปโชว์ที่หน้าเว็บ
        const cartCount = req.session.cart ? req.session.cart.length : 0;
        res.render('showproducts', { data: data, cartCount: cartCount });
    })
    .catch((error) => console.log(error));
});

// 2. ระบบเพิ่มสินค้าลงตะกร้า (เก็บ ID ลง Session)
app.get('/addtocart/:id', (req, res) => {
    const id = req.params.id;

    // ถ้ายังไม่มีตะกร้า ให้สร้าง Array ว่างๆ เตรียมไว้
    if (!req.session.cart) {
        req.session.cart = [];
    }

    // ดัน ID สินค้าลงตะกร้า
    req.session.cart.push(id);
    console.log("ตะกร้าปัจจุบัน:", req.session.cart);

    // เด้งกลับไปหน้าแรก
    res.redirect('/');
});

// 3. หน้าแสดงตะกร้าสินค้า
app.get('/cart', (req, res) => {
    const cart = req.session.cart || [];

    // ถ้าตะกร้าว่าง
    if (cart.length === 0) {
        return res.render('showcart', { data: [], message: "ตะกร้าของคุณยังว่างเปล่า!" });
    }

    // ถ้ามีของในตะกร้า ต้องไปดึงข้อมูล API มาเทียบ ID
    const endpoint = 'http://10.110.194.140:8000/menu';
    fetch(endpoint)
    .then((respon) => respon.json())
    .then((allProducts) => {
        
        // กรองเอาเฉพาะสินค้าที่มี ID ตรงกับใน Session ตะกร้าของเรา
        let cartItems = [];
        cart.forEach(cartId => {
            // ใช้ .toString() เพื่อให้ตัวเลขกับข้อความเทียบกันได้ชัวร์ๆ
            const matchedProduct = allProducts.find(p => p.id.toString() === cartId.toString());
            if (matchedProduct) {
                cartItems.push(matchedProduct);
            }
        });

        res.render('showcart', { data: cartItems, message: null });
    })
    .catch((error) => console.log(error));
});

// 4. ล้างตะกร้า
app.get('/clearcart', (req, res) => {
    req.session.cart = [];
    res.redirect('/cart');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});