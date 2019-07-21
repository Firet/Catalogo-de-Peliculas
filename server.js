const express = require('express');
const app = express();
const path = require('path');
const expressSession = require('express-session');
const multer = require('multer');
// Estalezco una estrategia de guardado con multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/');
    },
    filename: function (req, file, cb) {
        // Esto es para que le ponga de nombre a la imagen la fecha,dia,hora. pero tira error
        //cb(null, new Date().toISOString() + file.originalname);
        cb(null, file.originalname);
    }
});
const fileFilter = (req, file, cb) => {

    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        // Guardo el archivo que se intenta subir, null hace que no tire errores
        cb(null, true);
    }
    else {
        // Rechazo el archivo que se intenta subir,
        cb(new Error('Mensaje de error: Solo imágenes jpg y png.'), false);
    }
};
// Establezco una carpeta donde multer va a guardar las imagenes
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

// Manejo de sesión en Express con opciones basatante default, orientadas a cuestiones de seguridad.
app.use(expressSession({
    secret: 'Acordate de tomar buenas decisiones',
    resave: false,
    saveUninitialized: false
}));


const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
// Javascript y módulos propios 
const login = require('./server/login');
const ObjectId = require('mongodb').ObjectID;
// Obtenemos el objeto MongoClient
const MongoClient = require('mongodb').MongoClient;
// Configuramos la url dónde está corriendo MongoDB, base de datos y nombre de la colección
const url = 'mongodb://localhost:27017';
const dbName = 'catalogo';
const collectionName = 'peliculas';

//Creación una nueva instancia de MongoClient
const client = new MongoClient(url);

// Utilizo el método connect para conectarnos a MongoDB
client.connect(function (err, client) {
    console.log("Conectado a MongoDB, usando la base de datos " + dbName);
    // Luego de usar la conexión podemos cerrarla
    client.close();
});

// Middleware de body-parser para json
app.use(bodyParser.json());

// Ruta de recursos estáticos
app.use(express.static(path.join(__dirname, "./public")));

// Configuración de Handlebars
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, "views/layouts")
}));
app.set('view engine', 'handlebars');
app.set("views", path.join(__dirname, "./views"));
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/index', function (req, res) {
    //console.log("get a /index");
    res.render('home');
});

app.get('/contacto', function (req, res) {
    //console.log("get a /contacto");
    res.render('contacto', { selected: { contact: true } });
});

app.get('/contacto/submitporget', function (req, res) {
    // vemos en la consola del server el objeto query con todos los datos
    console.log(req.query)

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

// Configuración de Login en la ruta raiz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/landing.html'));
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

app.get('/series', function (req, res) {
    //console.log("get a /series");
    const client = new MongoClient(url);
    client.connect(function (err, client) {
        const db = client.db(dbName);
        // Cambio de colección
        const collectionName = 'series';
        const coleccion = db.collection(collectionName);
        coleccion.find().toArray(function (err, series) {
            client.close();
            res.render('series', { series_: series, selected: { series_: true } });
        });
    });
});

app.get('/peliculas', function (req, res) {
    //console.log("get a /peliculas");
    const client = new MongoClient(url);
    client.connect(function (err, client) {
        const db = client.db(dbName);
        // Cambio de colección
        const collectionName = 'peliculas';
        const coleccion = db.collection(collectionName);
        coleccion.find().toArray(function (err, peliculas) {
            client.close();
            res.render('peliculas', { peliculas_: peliculas, selected: { peliculas_: true } });
        });
    });
});

// El get de la pelicula individual, filtrado por titulo 
app.get('/pelicula/:titulo', function (req, res) {
    const titulo = req.params.titulo;
    console.log(titulo);
    const client = new MongoClient(url);
    client.connect(function (err, client) {
        const db = client.db(dbName);
        const coleccion = db.collection(collectionName);
        // Ejemplo de como buscar: coleccion.findOne({ "titulo": "Eyes Wide Shut" } 
        coleccion.findOne({ "titulosinespacio": titulo }, function (err, pelicula) {
            console.log(pelicula);
            client.close();
            res.render('pelicula', { pelicula: pelicula })
        });
    });
});

app.get('/peliculas/nueva', function (req, res) {
    res.render('peliculasform');
});

app.post('/peliculas/nueva', function (req, res) {
    const pelicula = {
        titulo: req.body.titulo,
        titulosinespacio: req.body.titulosinespacio,
        director: req.body.director,
        ruta: req.body.imagen,
    }
    console.log(pelicula);
    const client = new MongoClient(url);

    client.connect(function (err, client) {
        const db = client.db(dbName);
        // Cambio de colección
        const collectionName = 'peliculas';
        const coleccion = db.collection(collectionName);
        coleccion.insertOne(pelicula, function (error, resultado) {
            res.render('peliculasform', { message: 'Pelicula creada!' })
        });
    });
});

app.post('/peliculas/borrar/:id', function (req, res) {
    const id = req.params.id

    const client = new MongoClient(url);

    client.connect(function (err, client) {
        const db = client.db(dbName);
        const coleccion = db.collection(collectionName);
        coleccion.deleteOne({ _id: ObjectId(id) }, function (err, resultado) {
            res.redirect('/peliculas');
        })
    })
})


app.get('/peliculas/update/:id', function (req, res) {
    const id = req.params.id;
    const client = new MongoClient(url);

    client.connect(function (err, client) {
        const db = client.db(dbName);
        const coleccion = db.collection(collectionName);
        coleccion.findOne({ _id: ObjectId(id) }, function (err, pelicula) {
            client.close();
            res.render('actualizarpelicula', { pelicula: pelicula });
        });
    });
});

app.post('/peliculas/update/:id', function (req, res) {
    const id = req.params.id;
    const pelicula = {
        titulo: req.body.titulo,
        titulosinespacio: req.body.titulosinespacio,
        director: req.body.director,
        ruta: req.body.ruta,
        // falta el campo 'estaenfavoritos'
    }

    console.log(pelicula);
    const client = new MongoClient(url);

    client.connect(function (err, client) {
        const db = client.db(dbName);
        const coleccion = db.collection(collectionName);
        coleccion.updateOne({ _id: ObjectId(id) }, { $set: pelicula }, function (err, respuesta) {
            coleccion.findOne({ _id: ObjectId(id) }, function (err, pelicula) {
                client.close();
                res.render('actualizarpelicula', { message: 'Pelicula actualizada!', pelicula: pelicula });
            });
        });
    });
});

app.get('/favoritos', function (req, res) {
    //console.log("get a /favoritos");
    const client = new MongoClient(url);
    client.connect(function (err, client) {
        const db = client.db(dbName);
        // Cambio de colección
        const collectionName = 'favoritos';
        const coleccion = db.collection(collectionName);
        coleccion.find().toArray(function (err, favoritos) {
            client.close();
            res.render('favoritos', { favoritos_: favoritos, selected: { favoritos_: true } });
        });
    });
});

/*
Post a api que manda una pelicula a favoritos
se guarda el id, se busca a con findOne un registro con ese id,
se actualiza el dato estaenfavoritos = true, y se crea un campo en
la colección favoritos
*/
app.post('/peliculas/fav/:id', function (req, res) {
    const id = req.params.id;

    const client = new MongoClient(url);

    client.connect(function (err, client) {
        const db = client.db(dbName);
        const collectionName = "peliculas";
        const coleccion = db.collection(collectionName);
        coleccion.findOne({ _id: ObjectId(id) }, function (err, respuesta) {
            // Acá actualizo el objeto, lo busco con el id y le cambio estaenfavoritos a true
            coleccion.updateOne({ _id: ObjectId(id) }, { $set: { estaenfavoritos: true } }, function (err, actualizacion) {
                // Cambio la coleccion a favoritos
                const collectionName = "favoritos";
                const coleccion = db.collection(collectionName);
                // Agrego el siguiente documento
                coleccion.insertOne({
                    titulo: respuesta.titulo,
                    titulosinespacio: respuesta.titulosinespacio,
                    ruta: respuesta.ruta,
                    estaenfavoritos: true
                    // falta el director
                }, function (err, pelicula) {
                    client.close();
                    res.redirect("/favoritos");
                });
            });
        });
    });
});


//post para sacar un elemento de favoritos
app.post('/peliculas/unfav/:id', function (req, res) {
    const id = req.params.id;

    const client = new MongoClient(url);

    client.connect(function (err, client) {
        const db = client.db(dbName);
        const collectionName = "favoritos";
        const coleccion = db.collection(collectionName);
        //Busco el documento con el _id y guardo el titulo
        coleccion.findOne({ _id: ObjectId(id) }, function (err, encontrado) {
            console.log(encontrado);
            // Usando titulo borro el documento de la colección favoritos, en peliculas sigue estando
            coleccion.deleteOne({ encontrado }, function (err, eliminado) {
                //console.log("deleteOne");
                //console.log(eliminado);
                // Me cambio a la colección peliculas
                const db = client.db(dbName);
                const collectionName = "peliculas";
                const coleccion = db.collection(collectionName);
                // Actualizo el objeto, lo busco con el id y le cambio estaenfavoritos a true
                coleccion.updateOne({ _id: ObjectId(id) }, { $set: { estaenfavoritos: false } }, function (err, actualizacion) {
                    client.close();
                    res.redirect("/favoritos");
                });
            });
        });
    });
});

// Prueba de post con multer. Implementar.
app.post("/prueba-multer", upload.single('imagenPelicula'), (req, res, next) => {
    console.log("req.file es: ");
    console.log(req.file);

    // tengo que guardar la ruta en la base de datos, hacer después

    res.redirect('/peliculas');
});

// Server Login
app.get("/registrarse", (req, res) => {
    res.render("registrar");
});

app.post("/registrarusuario", (req, res) => {
    const usuario = {
        usuario: req.body.usuario,
        mail: req.body.email,
        contraseña: req.body.contraseña
        //Implementar avatar
    }

    console.log(usuario);

    const client = new MongoClient(url);

    client.connect(function (err, client) {
        const db = client.db(dbName);
        // Cambio de colección
        const collectionName = 'usuarios';
        const coleccion = db.collection(collectionName);
        coleccion.insertOne(usuario, function (error, resultado) {
            //res.render('index', { message: 'Usuario creado!' })
            res.redirect("/");
        });
    });
});

app.get("/iniciarsesion", (req, res) => {
    // Mandar un archivo html comun, nada de hanblebars
    res.render(iniciarsesion);
});

app.post("/iniciarsesion", (req, res) => {
    // recibir los req bodies del form
    // conectarme a la base de datos y chequear que coincide los req bodies
    // con los datos de la coleccion usuarios de mongo db
    // ACA Y en todas las rutas se usa express sesion
});


//Asigno el puerto 4000 para que escuche el servidor
app.listen(4000, function () {
    console.log('Express escuchando en el puerto 4000');
});