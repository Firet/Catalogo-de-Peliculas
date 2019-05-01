const fs = require('fs');
const path = require('path');

module.exports.getDescription = function(id, success) {

    if (isNaN(id)) {
        success("Código inválido");
    } else {
        fs.readFile(path.join(__dirname, 'products.json'), (err, data) => {
            let productList = JSON.parse(data);
            let product = productList.find(product => product.id == id);

            console.log(product);

            if (product !== undefined) {
                success(product.description);
            } else {
                success("producto no encontrado");
            }
        });
    }

}