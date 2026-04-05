const express = require('express');
const app = express();

const port = 3000;
const path = require('path');

app.use(express.static(path.join(__dirname,'public')));

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname,'public','home.html'));
});

app.get('/padthai', (req,res) => {
    res.sendFile(path.join(__dirname,'public','padthai.html'));
});

app.listen(port, () => {
    console.log("App running at port 3000");
});