// database.js
const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "webdev.it.kmitl.ac.th",
    user: "s67070200",
    password: "KOF94VZG28U",
    database: "s67070200",
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to MySQL database.');
});

module.exports = connection;
