const { error } = require('console');
const express = require('express');
const app = express();

const path = require('path');
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/', (req,res) => {
    const endpoint = 'http://10.110.194.140:8000/menu';

    fetch(endpoint)
    .then((respon)=>respon.json())
    .then((data)=> {
        console.log(data)
        res.render('show',{ data:data})})
    .catch((error)=>console.log(error));
});

app.get('/detail/:id', (req,res) => {

    const id = req.params.id;
    const endpoint = 'http://10.110.194.140:8000/items/'+id;

    fetch(endpoint)
    .then((respon)=>respon.json())
    .then((data)=> {
        console.log(data)
        res.render('product',{ product:data})})
    .catch((error)=>console.log(error));
});

app.listen(port, ()=>{
    console.log('App running at port 3000');
});