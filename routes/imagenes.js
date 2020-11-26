const express = require('express');

const fs = require('fs');

const path = require('path');
const { verificaTokenImg } = require('../server/middlewares/autenticacion');

const app = express();

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;


    let pathImg = `-/uploads/${tipo}/${img}`;
    let pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${img}`);
    // console.log(pathImagen);
    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        let noImagePath = path.resolve(__dirname, '../server/assets/no-image.jpg');

        res.sendFile(noImagePath);
    }



});

module.exports = app;