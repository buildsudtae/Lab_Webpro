const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const port = 3000;

// connect database
let db = new sqlite3.Database("questions.db", (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log("Connected to SQLite database.");
});

app.set("view engine", "ejs");
app.use(express.static("public"));


// =====================
// Show All Questions
// =====================
app.get("/", function (req, res) {

    const sql = "SELECT * FROM questions";

    db.all(sql, (err, rows) => {
        if (err) {
            console.log(err.message);
        }

        res.render("questions", { data: rows });
    });

});


app.listen(port, () => {
    console.log("Server started at port " + port);
});
