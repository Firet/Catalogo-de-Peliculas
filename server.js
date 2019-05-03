const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');

//app.use('/assets', express.static('public'));

app.listen(4000, function () {
    console.log('Express escuchando en el puerto 4000!');
});

// ***********HANDLEBARS**************************************************************************

app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, "views/layouts")
}));
app.set('view engine', 'handlebars');
app.set("views", path.join(__dirname, "./views"));

app.get('/index', function (req, res) {
    res.render('home');
});

app.use(express.static('public'));

app.get('/contacto', function (req, res) {
    res.render('contacto', { selected: { contact: true } });
});
/*
const peliculas = [
    { titulo: 'Dune', fechaDeEstreno: ['22 de Mayo de 2020'] },
    { titulo: 'Mad max', fechaDeEstreno: ['23 de Enero de 2015'] }
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



*/
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

// ***********MONGO DB**************************************************************************
/*
// Obtenemos el objeto MongoClient
const MongoClient = require('mongodb').MongoClient

// Configuramos la url dónde está corriendo MongoDB, base de datos y nombre de la colección
const url = 'mongodb://localhost:27017';
const dbName = 'apple';
const collectionName = 'products';

// Creamos una nueva instancia de MongoClient
const client = new MongoClient(url);

// Utilizamos el método connect para conectarnos a MongoDB
client.connect(function (err, client) {
    // Acá va todo el código para interactuar con MongoDB
    console.log("Conectado a MongoDB, usando la base de datos " + dbName);


    // Luego de usar la conexión podemos cerrarla
    client.close();
});




app.get('/products', function (req, res) {
    const client = new MongoClient(url);
    client.connect(function (err, client) {
        const db = client.db(dbName);
        const coleccion = db.collection(collectionName);
        coleccion.find().toArray(function (err, productos) {
            client.close();
            res.render('products', { products: productos, selected: { products: true } });
        });
    });
});


// Modificamos la ruta/controller de api para que retorne también los mismos productos
app.get('/api/products', function (req, res) {
    const client = new MongoClient(url);
    MongoClient.connect(url, function (error, db) {
        var coleccion = db.collection('products');
        coleccion.find().toArray(function (err, productos) {
            db.close();
            res.json(productos);
        });
    });
});


// Ruta para un producto especifico ***
app.get('/products/:name', function (req, res) {
    const name = req.params.name

    MongoClient.connect(url, function (error, db) {
        var coleccion = db.collection('products');
        coleccion.findOne({ name: name }, function (err, producto) {
            db.close();
            res.render('product', { product: producto });
        });
    });
});


// Crear producto nuevo
app.get('/productos/nuevo', function (req, res) {
    res.render('productform')
});

app.post('/productos/nuevo', function (req, res) {
    const producto = {
        name: req.body.nombre,
        price: parseInt(req.body.precio),
        stock: parseInt(req.body.stock),
        picture: req.body.imagen,
        categories: ["macbook", "notebook"]
    };

    MongoClient.connect(url, function (error, db) {
        var coleccion = db.collection('products');
        coleccion.insertOne(producto, function (error, resultado) {
            res.render('productform', { message: 'Producto creado!' })
        });
    });
});

// Borrar un documento ***
const ObjectId = require('mongodb').ObjectID;

app.post('/productos/borrar/:id', function (req, res) {
    const id = req.params.id;

    MongoClient.connect(url, function (error, db) {
        var coleccion = db.collection('products');
        coleccion.deleteOne({ _id: ObjectId(id) }, function (err, resultado) {
            res.redirect('/products');
        });
    });
});

// Actualizar un documento ***
app.get('/productos/update/:id', function (req, res) {
    const id = req.params.id;
    const client = new MongoClient(url);

    client.connect(function (err, client) {
        const db = client.db(dbName);
        const coleccion = db.collection(collectionName);
        coleccion.findOne({ _id: ObjectId(id) }, function (err, producto) {
            client.close();
            res.render('updateproductform', { product: producto });
        });
    });
});


app.post('/productos/update/:id', function (req, res) {
    const id = req.params.id;
    const producto = {
        name: req.body.nombre,
        price: parseInt(req.body.precio),
        stock: parseInt(req.body.stock),
        picture: req.body.imagen
    }

    const client = new MongoClient(url);

    client.connect(function (err, client) {
        const db = client.db(dbName);
        const coleccion = db.collection(collectionName);
        coleccion.updateOne({ _id: ObjectId(id) }, { $set: producto }, function (err, respuesta) {
            coleccion.findOne({ _id: ObjectId(id) }, function (err, producto) {
                client.close();
                res.render('updateproductform', { message: 'Producto actualizado!', product: producto });
            });
        });
    });
})



*/
// ***********LOG IN**************************************************************************
const bodyParser = require('body-parser');

// JS propios (cambiar rutas, porque la locación del archivo en el que escribo debería cambiar de lugar)
const login = require('./server/login');
const products = require('./server/products');

// Middleware de body-parser para json
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/landing.html'));
    //usando handlebars seria así 
    //res.render('landing', { selected: { contact: true } });
});

// ESTA RUTA NO SE USA. CHEQUEAR SI LO BORRO O NO
app.get('/home', (req, res) => {
    // Responde con la página home.html
    res.sendFile(path.join(__dirname, './public/home.html'));
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




//************Intentando usar mongo con las series */
// Obtenemos el objeto MongoClient
const MongoClient = require('mongodb').MongoClient

// Configuramos la url dónde está corriendo MongoDB, base de datos y nombre de la colección
const url = 'mongodb://localhost:27017';
const dbName = 'catalogo';
const collectionName = 'series';

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
    const client = new MongoClient(url);
    client.connect(function (err, client) {
        const db = client.db(dbName);
        // Acá le cambié el nombre de la colección
        const collectionName = 'peliculas';
        const coleccion = db.collection(collectionName);
        coleccion.find().toArray(function (err, peliculas) {
            client.close();
            res.render('peliculas', { peliculas_: peliculas, selected: { peliculas_: true } });
        });
    });
});