const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


// =====================
// Connect DB (create if not exist)
// =====================
let db = new sqlite3.Database("product.db", (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log("Connected to SQLite database.");
});


// =====================
// Create Table if not exists
// =====================
const createTableSQL = `
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer TEXT,
    product TEXT,
    address TEXT,
    phone TEXT,
    status TEXT
)
`;

db.run(createTableSQL);


// =====================
// Home Page
// =====================
app.get("/", (req, res) => {

    const sql = "SELECT * FROM orders";

    db.all(sql, (err, rows) => {
        if (err) {
            console.log(err.message);
        }

        res.render("home", { data: rows });
    });

});


// =====================
// Add Order
// =====================
app.post("/add", (req, res) => {

    const { customer, product, address, phone } = req.body;

    const sql = `
        INSERT INTO orders (customer, product, address, phone, status)
        VALUES (?, ?, ?, ?, 'รอดำเนินการ')
    `;

    db.run(sql, [customer, product, address, phone], (err) => {
        if (err) {
            console.log(err.message);
        }
        res.redirect("/");
    });

});


// =====================
// Update Status
// =====================
app.post("/update/:id", (req, res) => {

    const id = req.params.id;
    const status = req.body.status;

    const sql = `
        UPDATE orders
        SET status = ?
        WHERE id = ?
    `;

    db.run(sql, [status, id], (err) => {
        if (err) {
            console.log(err.message);
        }
        res.redirect("/");
    });

});


app.listen(port, () => {
    console.log("Server started at port " + port);
});
