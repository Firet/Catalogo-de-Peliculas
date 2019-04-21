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

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');


app.get('/', function (req, res) {
    res.render('home');
});


app.use(express.static('public'))

app.get('/peliculas', function (req, res) {
    res.render('peliculas', { tituloDeSeccion: 'Sección de películas', peliculas: ['El señor de los anillos', 'Star trek', 'Citizen kane', 'Bonanza'] })
});

app.get('/contact', function (req, res) {
    res.render('contact');
});


const Peliculas = [
    { saga: 'Terminator', items: ['MacBook', 'MacBook Air', 'MacBook Pro', 'iMac', 'iMac Pro', 'Mac Pro', 'Mac mini', 'Accessories', 'High Sierra'] },
    { saga: 'Jurassic Park', items: ['iPad Pro', 'iPad', 'iPad mini 4', 'iOS 11', 'Accessories'] },
    { saga: 'Back to the future', items: ['iPhone X', 'iPhone 8', 'iPhone 7', 'iPhone 6s', 'iPhone SE', 'iOS 11', 'Accessories'] }
  ]

  app.get('/products', function (req, res) {
    res.render('products', { pelicula: Peliculas})
  })