
const mysql = require('mysql2');

const conn = mysql.createConnection({
    host: "webdev.it.kmitl.ac.th",
    user: "s67070200",
    password: "KOF94VZG28U",
    database: "s67070200"
});

conn.connect(error => {
    if (error) throw error;
    console.log("Successfully connected to the database.");
});

module.exports = conn;