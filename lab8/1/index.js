// index.js
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
    const createTableSql = `
        CREATE TABLE IF NOT EXISTS Users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) NOT NULL,
            password VARCHAR(50) NOT NULL,
            email VARCHAR(100),
            firstname VARCHAR(100),
            lastname VARCHAR(100),
            age INT,
            address TEXT,
            phone VARCHAR(20)
        )
    `;

    db.query(createTableSql, (err, result) => {
        if (err) throw err;
        console.log("Table 'Users' created or already exists.");

        db.query(createTableSql, (err, result) => {
            if (err) throw err;
            console.log("Table 'Users' created or checked successfully.");

            res.sendFile(path.join(__dirname, 'public', 'form.html'));
        });
    });
});

app.post('/register', (req, res) => {

    const { username, password, email, firstname, lastname, age, address, phone } = req.body;

    const sql = `INSERT INTO Users (username, password, email, firstname, lastname, age, address, phone) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [username, password, email, firstname, lastname, age, address, phone], (err, result) => {
        if (err) {
            console.error(err);
            res.send("Error saving data!");
        } else {
            res.redirect('/users');
        }
    });
});

app.get('/users', (req, res) => {
    const sql = "SELECT * FROM Users";
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.render('show', { users: results });
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});