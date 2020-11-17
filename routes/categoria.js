const express = require('express');

const app = express();

const { verificaToken } = require('../server/middlewares/autenticacion');
const { verificaAdmin_Role } = require('../server/middlewares/autenticacion');


const Categoria = require('../models/categoria');

const _ = require('underscore');

//listado de todas categorias GET
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find()
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }


            Categoria.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    categorias,
                    numcategorias: conteo
                })

            });


        })


});

//Mostrar una categoria por ID
app.get('/categoria/:id', verificaToken, (req, res) => {
    //Categoria.findById(...);
    let id = req.params.id;
    Categoria.findById(id).exec((err, categoria) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria
        })


    })
});


//Crear nueva categoria
app.post('/categoria', verificaToken, (req, res) => {
    //retorna la nueva categoria
    //req.usuario._id
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id,

    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    });

});

//Actualizar una categoria existente (La descripcion)
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion']);
    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        })

    })




});


//borrar una categoria

app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    //solo un admin puede eliminar
    //Categoria.findByIdAndRemove

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDel) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!categoriaDel) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDel
        });

    });
});




module.exports = app;