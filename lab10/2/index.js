const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = new sqlite3.Database("todo.db", (err) => {
    if (err) console.log(err.message);
    else console.log("Connected to SQLite");
});

db.run(`
    CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        description TEXT,
        deadline TEXT,
        status INTEGER DEFAULT 0
    )
`);

app.get("/api/todos", (req, res) => {
    db.all("SELECT * FROM todos", [], (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
});

app.post("/api/todos", (req, res) => {
    const { title, description, deadline } = req.body;
    db.run(
        `INSERT INTO todos (title, description, deadline, status)
         VALUES (?, ?, ?, 0)`,
        [title, description, deadline],
        function (err) {
            if (err) return res.status(500).json(err);
            res.json({
                message: "created",
                id: this.lastID
            });
        }
    );
});

app.put("/api/todos/:id", (req, res) => {
    const id = req.params.id;
    const { status } = req.body;
    db.run(
        `UPDATE todos SET status = ? WHERE id = ?`,
        [status, id],
        function (err) {
            if (err) return res.status(500).json(err);
            res.json({ message: "updated" });
        }
    );
});

app.get("/", (req, res) => {
    db.all("SELECT * FROM todos", [], (err, rows) => {
        if (err) return res.send("DB Error");
        res.render("todos", { todos: rows });
    });
});

app.listen(port, () => {
    console.log(`Server running http://localhost:${port}`);
});