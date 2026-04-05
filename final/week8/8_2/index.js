const express = require('express');
const app = express();

const path = require('path');
const port = 3000;

const conn = require('./database');

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname,'public','login.html'));
});

app.post('/login', (req,res) => {
    console.log("ข้อมูลที่ส่งมาจากฟอร์มคือ:", req.body);
    const {username,password} = req.body;

    const select = 'SELECT * FROM Users WHERE username = ? OR email = ?';

    conn.query(select, [username,username], function (err, result){
        if(err) throw err;

        if (result.length === 0){
            return res.send(`
                <h2 style="color:red;">ไม่พบบัญชีผู้ใช้ (User not found)</h2>
                <a href="/">กลับไปหน้า Login</a>
            `);
        }

        const user = result[0];
        if (user.password !== password){
            return res.send(`
                <h2 style="color:red;">รหัสผ่านไม่ถูกต้อง (Incorrect password)</h2>
                <a href="/">กลับไปหน้า Login</a>
            `);
        }

        res.render('profile', {user:user});
    });
});

app.listen(port, () => {
    console.log('App running at port 3000');
});