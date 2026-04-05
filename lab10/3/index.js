const express = require("express");
const app = express();
const port = 3000;

app.set("view engine", "ejs");

app.get("/", async (req, res) => {

    try {
        const response = await fetch("http://webdev.it.kmitl.ac.th:4000/books");
        const books = await response.json();
        res.render("home", { books });
    } catch (err) {
        console.error(err);
        res.send("Error loading books");
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});