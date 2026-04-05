const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const port = 3000;

let db = new sqlite3.Database("userdata.db", (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log("Connected to SQLite database.");
});

app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/", function (req, res) {

    const sql = "SELECT * FROM users";

    db.all(sql, (err, rows) => {
        if (err) {
            console.log(err.message);
        }

        res.render("home", { data: rows });
    });

});

app.get("/detail/:id", function (req, res) {

    const id = req.params.id;

    const sql = "SELECT * FROM users WHERE id = " + id;

    db.get(sql, (err, row) => {
        if (err) {
            console.log(err.message);
        }

        res.render("detail", { user: row });
    });

});

app.listen(port, () => {
    console.log("Server started at port " + port);
});
