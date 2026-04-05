const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "webdev.it.kmitl.ac.th",
    user: "s67070200",
    password: "KOF94VZG28U",
    database: "s67070200",
    charset: "utf8mb4"
});

connection.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to MySQL.");
});

module.exports = connection;
