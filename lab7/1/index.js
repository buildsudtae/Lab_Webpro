const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// static folder
app.use(express.static('public'));

// routes
app.get('/', (req, res) => {
     res.sendFile(path.join(__dirname, '/public/home.html'));
});

app.get('/cats', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/cats.html'));
});

app.get('/dogs', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/dogs.html'));
});

app.get('/birds', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/birds.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/about.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});