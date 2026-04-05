const express = require('express');
const app = express();

const port = 3000;
const path = require('path');
const conn = require('./database');

app.use(express.static(path.join(__dirname,'public')));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.get('/', (req,res) => {
    const createTable = `CREATE TABLE IF NOT EXISTS Users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) NOT NULL,
            password VARCHAR(50) NOT NULL,
            email VARCHAR(100),
            firstname VARCHAR(100),
            lastname VARCHAR(100),
            age INT,
            address TEXT,
            phone VARCHAR(20)
    )`;

    conn.query(createTable, function(err,result){
        if(err) throw err
        console.log('Create Table already');

        res.sendFile(path.join(__dirname,'/public/home.html'));
    });
});

app.post('/formget', (req,res) => {
    const {username, password, email, firstname, lastname, age, address, phone} = req.body;

    const insertMySQL = `INSERT INTO Users (username, password, email, firstname, lastname, age, address, phone) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    conn.query(insertMySQL, [username, password, email, firstname, lastname, age, address, phone], function(err,result){
        if(err) throw err

        console.log(result);
        res.redirect('/showdata');
    });
});

app.get('/showdata', (req,res) => {
    const select = `SELECT * FROM Users;`;

    conn.query(select, function(err, result){
        if(err) throw err

        console.log(result);
        res.render('show',{ data:result });
    });
});

app.listen(port, () => {
    console.log('App running at port 3000');
});