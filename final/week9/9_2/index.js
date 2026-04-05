const express  = require('express');
const app = express();

const path = require('path');
const port = 3000;

const sqlite3 = require('sqlite3').verbose();

app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));

let db = new sqlite3.Database('product.db', (err)=>{
    if(err) throw err;

    console.log('Create data already');
});

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

app.get('/', (req,res)=>{
    const select = 'SELECT * FROM orders';

    db.all(select, function (err, result){
        if(err)  throw err;

        res.render('show', {data:result});
    });
});

app.post('/add', (req,res) => {
    const {customer,product ,address ,phone} = req.body;
    const insert = 'INSERT INTO orders(customer,product ,address ,phone ,status) VALUES (?,?,?,?,?)'

    db.run(insert,[customer,product ,address ,phone ,'รอดำเนินการ'], function(err,result){
        if(err) throw err

        res.redirect('/');
    });
});

app.post('/update/:id', (req,res) => {
    const id = req.params.id;
    const status = req.body.status;
    const update = 'UPDATE orders SET status = ? WHERE id = ?'

    db.run(update,[status, id], function(err,result){
        if(err) throw err

        res.redirect('/');
    });
});

app.listen(port, ()=>{
    console.log('App running at port 3000');
});