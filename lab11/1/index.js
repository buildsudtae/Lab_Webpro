const express = require('express');
const cookieParser = require('cookie-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// ตั้งค่า Middleware
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // ชี้ไปที่โฟลเดอร์ views

// เชื่อมต่อฐานข้อมูล SQLite
const db = new sqlite3.Database('./customers.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to the customers.db database.');
    }
});

// (A) หน้าแรก: ให้สุ่มอ่านข้อมูลจาก database มา 1 รายการ แล้วแสดงในฟอร์ม
app.get('/', (req, res) => {
    const sql = "SELECT CustomerId, FirstName, LastName, Address, Email, Phone FROM customers ORDER BY RANDOM() LIMIT 1";
    db.get(sql, [], (err, row) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send("Database error");
        }
        res.render('form', { data: row || {} });
    });
});

// Route สำหรับแสดงฟอร์มแบบว่างเปล่า (ใช้ตอน Save และ Clear)
app.get('/empty', (req, res) => {
    res.render('form', { data: {} });
});

// (B) เมื่อคลิกปุ่ม Save Data: ให้เก็บข้อมูลลง Cookie และลบข้อมูลในฟอร์ม (โดย redirect ไปหน้า /empty)
app.post('/save', (req, res) => {
    const empData = req.body;
    res.cookie('employeeCookie', empData, { maxAge: 1000 * 60 * 60, httpOnly: true }); 
    res.redirect('/empty');
});

// (C) เมื่อคลิกปุ่ม Show Data: ให้นำข้อมูลที่เก็บไว้ใน Cookie มาแสดง
app.get('/show', (req, res) => {
    const savedData = req.cookies.employeeCookie || {};
    res.render('form', { data: savedData });
});

// (D) เมื่อคลิกปุ่ม Clear Data: ให้ลบข้อมูลใน Cookie ทั้งหมด และลบข้อมูลในฟอร์มออก
app.get('/clear', (req, res) => {
    res.clearCookie('employeeCookie');
    res.redirect('/empty');
});

// เริ่มการทำงานของ Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});