require('./config/config')

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');


const app = express();

var bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));
//console.log(path.resolve(__dirname, '../public'));

//Configuracion global de rutas
app.use(require('../routes/index'));



//conexion a la base de datos
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
    (err, res) => {
        if (err) throw err;
        console.log('base de datos ONLINE');

    });

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto:', process.env.PORT);
})