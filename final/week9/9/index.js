const express = require("express");
const path = require("path");
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// ================= 1. Database Setup =================
let db = new sqlite3.Database('company.db', (err) => {    
    if (err) return console.error(err.message);
    console.log('Connected to the SQlite database.');

    // สร้างตารางเมื่อเริ่มเซิร์ฟเวอร์
    const createSql = `
        CREATE TABLE IF NOT EXISTS employees (
            EmployeeId INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            LastName NVARCHAR(20) NOT NULL,
            FirstName NVARCHAR(20) NOT NULL,
            Title NVARCHAR(30),
            Phone NVARCHAR(24),
            Email NVARCHAR(60) 
        );
    `; 
    db.run(createSql, (err) => { 
        if (err) return console.error('Error creating table:', err.message); 
        console.log('Table checked/created successfully'); 
    });
});

// ================= 2. Middleware Settings =================
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// ================= 3. Routing (CRUD) =================

// หน้าแรก (Home)
app.get('/', (req, res) => {
    res.render('home');
});

// หน้าฟอร์ม (Form)
app.get('/form', function (req, res) {
    res.sendFile(path.join(__dirname, "public", "form.html"));
});

// [CREATE] รับข้อมูลจากฟอร์มมา Insert ลง Database
app.get('/formget', function (req, res) {
    const { fname, lname, title, phone, email } = req.query;
    
    // ใช้ ? เพื่อความปลอดภัยและเขียนง่าย
    let sql = `INSERT INTO employees (FirstName, LastName, Title, Phone, Email) VALUES (?, ?, ?, ?, ?)`;
    
    db.run(sql, [fname, lname, title, phone, email], function(err) {
        if (err) return console.error('Error inserting data:', err.message);
        console.log(`A row has been inserted. Last ID: ${this.lastID}`);
        res.send("Data inserted successfully! <br><br><a href='/show'>View all employees</a>");
    });
});

// [READ] ดึงข้อมูลมาแสดงเป็นตาราง
app.get('/show', function (req, res) {
    const query = 'SELECT * FROM employees';
    
    db.all(query, (err, rows) => {
        if (err) return console.log(err.message);
        res.render('show', { data: rows });
    });
});

// [DELETE] ลบข้อมูล
app.get('/delete/:id', (req, res) => {
    let sql = `DELETE FROM employees WHERE EmployeeId = ?`;
    
    db.run(sql, req.params.id, function(err) {
        if (err) return console.error(err.message);
        console.log(`Row(s) deleted: ${this.changes}`);
        // ลบเสร็จให้กลับไปหน้าตาราง
        res.redirect('/show'); 
    });
});

// ================= 4. Start Server =================
app.listen(port, () => {
   console.log(`Server started at http://localhost:${port}`);
});