const express = require('express');

const app = express();
const _ = require('underscore');
const { verificaToken } = require('../server/middlewares/autenticacion');
//const { verificaAdmin_Role } = require('../server/middlewares/autenticacion');

let Producto = require('../models/producto');
let Categoria = require('../models/categoria');

//Obtener todos los productos
//haciendo populate de usuarios y categorias
//paginado
app.get('/productos', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    Producto.find({ disponible: true })
        .sort('nombre')
        .populate('usuario', 'nombre')
        .populate('categoria', 'descripcion')
        .skip(desde)
        .limit(limite)
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Producto.count({ disponible: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    numproductos: conteo
                })

            });

        });

});

//Obtener producto por ID
//haciendo populate de usuarios y categorias
app.get('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'descripcion')
        .exec((err, producto) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto
            })




        })

});

//Crear un producto
//grabando id de usuario
//grabando id de categorias
app.post('/productos', verificaToken, (req, res) => {
    let body = req.body;
    let categoriadesc = body.categoria;
    //comprobamos que existe la categoria y obtenemos su ID
    Categoria.findOne({ descripcion: categoriadesc }).exec((err, categoriaBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!categoriaBD) {
            return res.json({
                ok: false,
                message: 'No existe la categoria'
            });
        }
        // console.log(categoriaBD);
        let producto = new Producto({
            nombre: body.nombre,
            precioUni: Number(body.precioUni),
            descripcion: body.descripcion,
            disponible: true,
            categoria: categoriaBD._id,
            usuario: req.usuario._id
        });
        //console.log(producto);
        producto.save((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            })

        });

    });


});

//Actualizar un producto
app.put('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion']);
    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        })

    });

});

//Eliminar un producto
//marcando el disponible como false
app.delete('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: productoDB
        })

    });

});


//Buscar productos por nombre
//usando expresiones regulares
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');
    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            })

        });


});
module.exports = app;