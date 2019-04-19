const express = require('express');
const app = express();

app.get('/', function(request, response) {
  response.send('Ahora estamos usando expressssss!');
});

app.listen(3000, function() {
  console.log('Express app listening on port 3000!');
});


app.get('/json', function(req, res) {
    res.json({ nombre: 'Marta', edad: '40'});
  });