
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', (req, res) => {
    const { identity, password } = req.body;

    const sql = "SELECT * FROM Users WHERE username = ? OR email = ?";

    db.query(sql, [identity, identity], (err, results) => {
        if (err) throw err;

        if (results.length === 0) {
            return res.send(`
                <h2 style="color:red;">ไม่พบบัญชีผู้ใช้ (User not found)</h2>
                <a href="/">กลับไปหน้า Login</a>
            `);
        }

        const user = results[0];

        if (user.password !== password) {
            return res.send(`
                <h2 style="color:red;">รหัสผ่านไม่ถูกต้อง (Incorrect password)</h2>
                <a href="/">กลับไปหน้า Login</a>
            `);
        }

        res.render('profile', { user: user });
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});