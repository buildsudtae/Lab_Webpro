const express = require('express');
const app = express();

const path = require('path');
const port = 3000;

const SQLite3 = require('sqlite3').verbose();

let db = new SQLite3.Database('userdata.db', (err) => {    
  if (err) {
      return console.error(err.message);
  }
  console.log('Connected to the SQlite database.');
});

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req,res) => {
    const select = 'SELECT * FROM users';

    db.all(select, function (err,result){
        if(err) { throw err;}

        res.render('show', { data:result });
    });
});

app.get('/detail/:id', (req,res) => {
    const id = req.params.id;

    const selectid = 'SELECT * FROM users WHERE id = ?';
    db.get(selectid, id, function (err,result) {
        if(err) console.log(err);

        console.log(result);
        res.render('detail', { data:result });
    });
});

app.listen(port, () => {
    console.log('App running at port 3000');
});