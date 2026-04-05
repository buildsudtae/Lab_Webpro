const express = require("express");
const path = require("path");
const port = 3000;
const sqlite3 = require("sqlite3").verbose();

// Creating the Express server
const app = express();

// Connect to SQLite database (และสร้างตารางพร้อมข้อมูลจำลองให้ด้วย)
let db = new sqlite3.Database("smartphones.db", (err) => {
    if (err) return console.error(err.message);
    console.log("Connected to the SQlite database.");

    // เตรียมตารางและข้อมูลไว้ทดสอบ API
    db.run(
        `CREATE TABLE IF NOT EXISTS smartphones (id INTEGER PRIMARY KEY, name TEXT)`,
        () => {
            db.run(
                `INSERT OR IGNORE INTO smartphones (id, name) VALUES (1, 'iPhone 15'), (2, 'Galaxy S24')`,
            );
        },
    );
});

// Settings
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// หน้าแรกเอาไว้กดลิงก์ทดสอบ
app.get("/", (req, res) => {
    res.send(`
    <h2>Hello! REST API</h2>
    <a href='/smartphones'>1. ดูข้อมูล API ของเราเอง (JSON)</a><br>
    <a href='/show'>2. ดึง API ของเราเอง มาแสดงบนหน้าเว็บ (EJS)</a><br>
    <a href='/employees'>3. ดึง API ของมหาลัย มาแสดงบนหน้าเว็บ (EJS)</a>
  `);
});

// ==================================================
// Section 2 - Creating the Web Services (สร้าง API ของตัวเอง)
// ==================================================

// 2.1 สร้าง API ดึงข้อมูลทั้งหมด
app.get("/smartphones", (req, res) => {
    const query = "SELECT * FROM smartphones";
    db.all(query, (err, rows) => {
        if (err) return console.log(err.message);

        // ส่งข้อมูลออกไปในรูปแบบ JSON
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(rows));
    });
});

// 2.2 สร้าง API ดึงข้อมูลเฉพาะ ID ที่ระบุ
app.get("/smartphones/:id", (req, res) => {
    const id = req.params.id; // ดึง id จาก URL

    // ใช้ ? เพื่อความปลอดภัย
    const query = `SELECT * FROM smartphones WHERE id = ?`;

    db.all(query, [id], (err, rows) => {
        if (err) return console.log(err.message);

        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(rows));
    });
});

// ==================================================
// Section 3 - Using the Web Services (ดึง API มาใช้งาน)
// ==================================================

// 3.1 ดึงข้อมูลจาก API ของเราเอง (localhost:3000)
app.get("/show", (req, res) => {
    const endpoint = "http://localhost:3000/smartphones";

    fetch(endpoint)
        .then((response) => response.json()) // แปลงข้อมูลที่ได้ให้เป็น JSON
        .then((wsdata) => {
            console.log(wsdata);
            // โยนข้อมูลไปให้ไฟล์ show.ejs แสดงผล
            res.render("show", { title: "My Smartphones", data: wsdata });
        })
        .catch((error) => console.log(error));
});

// 3.2 ดึงข้อมูลจาก API ของมหาลัย
app.get("/employees", (req, res) => {
    const endpoint = "http://webdev.it.kmitl.ac.th:4000/employees";

    fetch(endpoint)
        .then((response) => response.json())
        .then((emp) => {
            console.log(emp);
            // โยนข้อมูลที่ดึงมาได้ ไปให้ไฟล์ show.ejs เหมือนกัน!
            res.render("show", { title: "KMITL Employees", data: emp });
        })
        .catch((error) => console.log(error));
});

// Starting the server
app.listen(port, () => {
    console.log(`Starting server at http://localhost:${port}`);
});
