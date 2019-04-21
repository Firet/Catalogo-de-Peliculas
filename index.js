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

// ***********HANDLEBARS**************************************************************************

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');


app.get('/', function (req, res) {
    res.render('home');
});

app.use(express.static('public'))

app.get('/contacto', function (req, res) {
    //res.render('contact');
    res.render('contacto', { selected: { contact: true } });
});

const peliculas = [
    { titulo: 'Dune', fechaDeEstreno: ['22 de Mayo de 2020'] },
    { titulo: 'Mass Effect', fechaDeEstreno: ['23 de Enero de 2029'] }
];

app.get('/peliculas', function (req, res) {
    //res.render('peliculas', { tituloDeSeccion: 'Sección de películas', peliculas: ['El señor de los anillos', 'Star trek', 'Citizen kane', 'Bonanza'] });
    res.render('peliculas', { nombreDeSeccion: 'Listado de Películas ', pelicula: peliculas });
});

const series = [
    { temporada: 'Game of Thrones', capitulo: ['Chapter', 'Chapter Air', 'Chapter Pro', 'iMac', 'iMac Pro', 'Mac Pro', 'Mac mini', 'Accessories', 'High Sierra'] },
    { temporada: 'Sillicon Valley', capitulo: ['iPad Pro', 'iPad', 'iPad mini 4', 'iOS 11', 'Accessories'] },
    { temporada: 'Six feet Under', capitulo: ['iPhone X', 'iPhone 8', 'iPhone 7', 'iPhone 6s', 'iPhone SE', 'iOS 11', 'Accessories'] }
];

app.get('/series', function (req, res) {
    res.render('series', { nombreDeSeccion: 'Listado de Series', serie: series });
});


// Configuramos la url para que espere un id
app.get('/series/:id', function (req, res) {
    const id = req.params.id;

    // Usamos el id como posición del elemento que estamos buscando
    const serie = series[id];

    // agregamos un dato serie a nuestro llamado de render para que le llegue este valor al template
    res.render('serie', { serie: serie });
});




app.get('/contacto/submitporget', function (req, res) {
    console.log(req.query) // vemos en la consola del server el objeto query con todos los datos

    const firstname = req.query.firstname;
    const lastname = req.query.lastname;
    const country = req.query.country;
    const subject = req.query.subject;

    res.send(`
      Nombre: ${firstname}
      Apellido: ${lastname}
      País: ${country}
      Mensaje: ${subject}
    `);
});