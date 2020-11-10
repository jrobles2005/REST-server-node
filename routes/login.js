const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const Usuario = require('../models/user');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


app.post('/login', (req, res) => {
        let body = req.body;
        Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            if (!usuarioDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "(Usuario) o contraseña incorrectos"
                    }
                });
            }

            if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Usuario o (contraseña) incorrectos"
                    }
                });
            }

            let token = jwt.sign({
                usuario: usuarioDB
            }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

            res.json({
                ok: true,
                usuario: usuarioDB,
                token

            })



        })





    })
    //Configuraciones de Google

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        email: payload.email,
        name: payload.name,
        img: payload.picture,
        google: true

    }


}




app.post('/google', async(req, res) => {
    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            })
        });


    /*  res.json({
         usuario: googleUser
     }); */
    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (usuarioDB) {
            if (usuarioDB.google === false) {
                //no deberia validarse a traves de Google
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe usar su autenticacion normal'
                    }
                });
            } else {
                //renovamos su token para que pueda seguir trabajando
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            }
        } else {
            //Si el usuario no existe en nuestra BD de usuarios
            let usuario = new Usuario();
            usuario.nombre = googleUser.name;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err: usuario,
                        err2: googleUser
                    });
                };
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });

            });

        }

    });

});



module.exports = app;