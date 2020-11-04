const express = require('express');

const app = express();

const bcrypt = require('bcrypt');

const _ = require('underscore');

const Usuario = require('../models/user');

const { verificaToken } = require('../server/middlewares/autenticacion');
const { verificaAdmin_Role } = require('../server/middlewares/autenticacion');


app.get('/', function(req, res) {
    res.json({ nombre: 'Hola Mundo' });
})

//devuelve el listado de todos los usuarios de la base de datos
/* 
app.get('/usuarios', function(req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite)
    Usuario.find({})
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }


            Usuario.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    numusuarios: conteo
                })

            });


        })
})

 */
//devueve el listado de los usuarios activos{estado:true}


//solicitid GET con middleware de verificacion de token
app.get('/usuarios', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite)
    Usuario.find({ estado: true })
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }


            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    numusuarios: conteo
                })

            });


        })
})


app.post('/usuarios', [verificaToken, verificaAdmin_Role], function(req, res) {

    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role

    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })

    });



})


app.put('/usuarios/:id', [verificaToken, verificaAdmin_Role], function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })

    })


    // res.json({ id });
})


//DELETE marcando el registro con estado:false

app.delete('/usuarios/:id', verificaToken, function(req, res) {


    let id = req.params.id;

    //let body = _.pick(req.body, [ 'estado']);

    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })

    });


});


//DELETE eliminando el registro por completo de la base de datos
/* 
app.delete('/usuarios/:id', function(req, res) {
    //res.json({ nombre: 'Get usuarios por delete' });

    let id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioDel) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioDel) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDel
        });
    });


});
 */




module.exports = app;