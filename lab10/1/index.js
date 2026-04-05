const express = require("express");

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.redirect("/products");
});

app.get("/products", async (req, res) => {
  const endpoint = "http://webdev.it.kmitl.ac.th:4000/restaurant";

  try {
    const response = await fetch(endpoint);
    const data = await response.json();

    res.render("products", { products: data });
  } catch (error) {
    console.log(error);
    res.send("Error");
  }
});

app.get("/detail/:id", async (req, res) => {
  const id = req.params.id;
  const endpoint = `http://webdev.it.kmitl.ac.th:4000/detail/${id}`;

  try {
    const response = await fetch(endpoint);
    const data = await response.json();

    res.render("detail", { product: data });
  } catch (error) {
    console.log(error);
    res.send("Error");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
