const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

// 1. หน้าหลัก
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'main.html'));
});

// 2. Pad Thai
app.get('/padthai', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'padthai.html'));
});

// 3. Caesar Salad
app.get('/caesar', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'caesar.html'));
});

// 4. Sushi Platter
app.get('/sushi', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sushi.html'));
});

// 5. Tacos al Pastor
app.get('/tacos', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'tacos.html'));
});

// 6. Butter Chicken
app.get('/butterchicken', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'butterchicken.html'));
});

// 7. Falafel Wrap
app.get('/falafel', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'falafel.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});