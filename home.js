// archivo home.js
var express = require('express');
var router = express.Router();

router.get('/asd', function(req, res) {
  res.send('Usamos el método GET');
  //response.sendFile(path.join(__dirname, './Public/index.html'));
});

router.post('/', function(req, res) {
  res.send('Usamos el método POST');
});

module.exports = router;