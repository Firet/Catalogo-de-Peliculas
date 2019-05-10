const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');

app.listen(4000, function () {
    console.log('Express escuchando en el puerto 4000');
});

app.use(express.static(path.join(__dirname, "./public")));

// ***********HANDLEBARS**************************************************************************

app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, "views/layouts")
}));
app.set('view engine', 'handlebars');
app.set("views", path.join(__dirname, "./views"));

app.get('/index', function (req, res) {
    console.log("get a /index");
    res.render('home');
});

app.get('/favoritos', function (req, res) {
    console.log("get a /favoritos");
    res.render('favoritos');
});

app.get('/contacto', function (req, res) {
    console.log("get a /contacto");
    res.render('contacto', { selected: { contact: true } });
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

// ***********LOG IN**************************************************************************
const bodyParser = require('body-parser');

// JS propios (cambiar rutas, porque la locación del archivo en el que escribo debería cambiar de lugar)
const login = require('./server/login');

// Middleware de body-parser para json
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/landing.html'));
    //usando handlebars seria así 
    //res.render('landing', { selected: { contact: true } });
});

// POST /login
app.post('/login', (req, res) => {
    console.log(req.body);
    if (req.body.user !== undefined && req.body.password !== undefined) {
        if (login.validarUsuario(req.body.user, req.body.password)) {
            res.send('/index');
        } else {
            res.sendStatus(403);
        }
    } else {
        res.status(403).end();
    }

});

//************Mongo*************************************************************************************************/
// Obtenemos el objeto MongoClient
const MongoClient = require('mongodb').MongoClient;

// Configuramos la url dónde está corriendo MongoDB, base de datos y nombre de la colección
const url = 'mongodb://localhost:27017';
const dbName = 'catalogo';
const collectionName = 'peliculas';

// Creamos una nueva instancia de MongoClient
const client = new MongoClient(url);

// Utilizamos el método connect para conectarnos a MongoDB
client.connect(function (err, client) {
    // Acá va todo el código para interactuar con MongoDB
    console.log("Conectado a MongoDB, usando la base de datos " + dbName);
    // Luego de usar la conexión podemos cerrarla
    client.close();
});

app.get('/series', function (req, res) {
    console.log("get a /series");
    const client = new MongoClient(url);
    client.connect(function (err, client) {
        const db = client.db(dbName);
        const coleccion = db.collection(collectionName);
        coleccion.find().toArray(function (err, series) {
            client.close();
            res.render('series', { series_: series, selected: { series_: true } });
        });
    });
});

app.get('/peliculas', function (req, res) {
    console.log("get a /peliculas");
    const client = new MongoClient(url);
    client.connect(function (err, client) {
        const db = client.db(dbName);
        // Acá le cambié de colección
        const collectionName = 'peliculas';
        const coleccion = db.collection(collectionName);
        coleccion.find().toArray(function (err, peliculas) {
            client.close();
            res.render('peliculas', { peliculas_: peliculas, selected: { peliculas_: true } });
        });
    });
});

// el get de la pelicula individual, filtrado por titulo 
app.get("/pelicula/:titulo", function (req, res) {

    const titulo = req.params.titulo;
    console.log("get a /pelicula/" + titulo);
    client.connect(function (error, client) {
        const db = client.db("catalogo");
        const collectionName = 'peliculas';

        // collectionName.findOne({}, (err, docs) => {
        //     if (err) {
        //         console.log(err);
        //     } else {
        //         console.log(docs);
        //     }
        //     db.close();
        // });
        res.render('pelicula');
    });
});

// api de peliculas, voy a llamar por ajax desde el script de peliculas.handlebars
// app.get('/api/peliculas', function (req, res) {
//     const client = new MongoClient(url);
//     MongoClient.connect(url, function (error, db) {
//         const db = client.db(dbName);
//         const collectionName = 'peliculas';
//         //const coleccion = db.collection(collectionName);
//         collectionName.find().toArray(function (err, peliculasBD) {
//             db.close()
//             res.json(peliculasBD)
//         })
//     })
// })

//Esto es parecido de lo que puso el profe modificando la ruta, la base de datos y la coleccion
app.post("/borrarpelicula", (req, res) => {

    console.log(req.body);

    if (req.body.id == undefined) {
        res.redirect("/");
        return;
    }

    MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {

        const db = client.db("catalogo");
        const collection = db.collection("peliculas");

        collection.deleteOne({
            // El error está acá !!!!
            _id: new mongodb.ObjectID(req.body.id)
        }, (err, response) => {
            if (err == undefined) {
                console.log(response);
                res.redirect("/");
            } else {
                console.log(err);
                res.send("ERROR");
            }
            client.close();
        });
    });
});
