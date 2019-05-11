// Exporto las dos funciones en el objeto module.exports
module.exports.getAll = getAll;
module.exports.deleteOne = deleteOne;

// Librería de mongodb
const mongodb = require('mongodb');

// MongoClient
const MongoClient = mongodb.MongoClient;
const mongoURL = 'mongodb://localhost:27017';
const dbName = "catalogo";

/**
 * Función que consulta todos los registros de la colección "peliculas".
 * 
 * @param {function} cbDataReady Callback para pasar los datos resultantes de la consulta
 * @param {function} cbError Callback para retornar mensaje de error si lo hubiera
 * 
 */
function getAll(cbDataReady, cbError) {

    // Si quieren probar qué pasa cuando tirar error, descomenten estas dos líneas:
    // cbError("error de no asasd asd laksdj lñakjw ieoa ");
    // return;

    MongoClient.connect(mongoURL, { useNewUrlParser: true }, (err, client) => {

        if (err) {
            // Error en la conexión
            cbError("No se pudo conectar a la DB. " + err);
        } else {

            // Me traigo un objeto que apunte a la db "catalogo"
            const db = client.db(dbName);
            // Me traigo un objeto que apunte a la colección "peliculas"
            const collection = db.collection("peliculas");

            // Consulto TODOS los elementos de la colección, los convierto en Array y los paso al render
            collection.find().toArray((err, list) => {
                if (err) {
                    cbError("Error al consultar productos. " + err);
                } else {
                    cbDataReady(list);
                }
            });
        }

        // Cierro la conexión
        client.close();
    });
}


/**
 * Borra un registro de la base de datos
 * 
 * @param {string} documentId Id del registro en MongoDB (_id)
 * @param {function} cbDataReady Callback de éxito, retorna cantidad de documentos eliminados
 * @param {function} cbError Callback para retornar mensaje de error si lo hubiera
 * 
 */
function deleteOne(documentId, cbDataReady, cbError) {

    MongoClient.connect(mongoURL, { useNewUrlParser: true }, (err, client) => {

        if (err) {            
            // Error en la conexión
            cbError("No se pudo conectar a la DB. " + err);
        } else {

            const db = client.db(dbName);
            const collection = db.collection("peliculas");

            // El _id de Mongo es un tipo específico, hay que convertirlo con la función ObjectID de la librería de mongodb
            collection.deleteOne({ _id: new mongodb.ObjectID(documentId) }, (err, response) => {
                
                // Verifico el objeto "err"
                if (err == undefined) {
                    // OK, llamo al callback de éxito (sin argumentos, no hay nada que le quiera informar).
                    cbDataReady();
                } else {
                    // Error. Llamo al callback de error con el mensaje.
                    cbError("No se pudo eliminar el producto. " + err);
                }
                
                // Cierro la conexión
                client.close();
            });

        }
    });

}