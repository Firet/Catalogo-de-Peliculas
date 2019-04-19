console.log("index.js");
console.log('Bienvenidos a Node.js server side');

const express = require('express')




const obtenerPrecio = require('./calcular')
const precio = obtenerPrecio(200)
console.log(precio)