const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');

app.use('/assets', express.static('public'));


app.listen(3000, function () {
    console.log('Express app listening on port 3000!');
});


app.get('/json', function (req, res) {
    res.json({ nombre: 'Paul Atreides', edad: '35' });
});


//Ruta a la página de inicio
// app.get('/inicio', function(request, response) {
//     response.sendFile(path.join(__dirname, './Public/index.html'));
// });


// var wiki = require('./home.js');

// app.use('/', wiki);



// HANDLEBARS

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')


app.get('/', function (req, res) {
    res.render('home')
});


app.use(express.static('public'))

app.get('/peliculas', function (req, res) {
    res.render('peliculas')
});

app.get('/contact', function (req, res) {
    res.render('contact')
});

app.get('/products', function (req, res) {
//    res.render('products', { nombre: 'Producto a mostrar'});
    res.render('products', { nombre: 'Productos a mostrar', products: ['tv', 'printer', 'ps4']});
    //res.render('product', { product: product })
})