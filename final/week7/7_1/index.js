const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

app.use(express.static(path.join(__dirname,'public')));

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname,'public','home.html'));
});

app.get('/dog', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/dog.html'));
});

app.listen(port, () => {
    console.log(`Web running at port ${port}`);
});