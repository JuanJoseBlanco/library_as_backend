const { Router } = require('express')
const { check } = require('express-validator')
const con = require('../models/connection')
const bcrypt = require('bcrypt')

const Token = require('../models/token')
const token = new Token()

const router = Router()

// Creación de usuario
router.post('/signup', (req, res)=>{
    const user = {
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        username: req.body.username,
        role: req.body.role
    }

    let verifyEmail = `SELECT email FROM users WHERE email = '${user.email}'`
    con.query(verifyEmail, (err, result) => {
        if(err) throw err;
        else {
            console.log(result);
            if(result.length == 0){
                con.query('ALTER TABLE users AUTO_INCREMENT = 1', function (err, result) {
                    if (err) throw err;
                });

                let sql = `INSERT INTO users (email, password, username, role) VALUES ('${user.email}', '${user.password}', '${user.username}', ${user.role})`

                con.query(sql, (err, result) => {
                    if(err){
                        res.json({
                            ok: false,
                            message: 'Ocurrió un error durante la inserción, por favor inténtelo nuevamente'
                        })
                    }else{
                        console.log("User created succesfully!");
                        res.json({
                            ok: true,
                            message: 'Usuario registrado exitosamente'
                        })
                    }
                })
            }else{
                res.json({
                    ok: false,
                    message: `El correo ${user.email} ya se encuentra registrado. Intente con otro`
                })
            }
        }
    })
})

// Inicio de sesión
router.post('/login', (req, res) => {
    const body = req.body
    let sql = `SELECT email, password FROM users WHERE email = '${body.email}'`
    con.query(sql, (err, result) => {
        if(err) throw err
        if(result.length > 0){
            const data = result[0]
            if(bcrypt.compareSync(body.password, data.password)){
                let queryUser = `SELECT email, username, role FROM users WHERE email = '${body.email}'`;
                con.query(queryUser, (err, resp) => {
                    if(err) throw err;
                    let infoUser = resp[0];

                    const userToken = token.getJwtToken({
                        id: infoUser.id,
                        email: infoUser.email,
                        username: infoUser.username,
                        role: infoUser.role
                    });

                    res.json({
                        ok: true,
                        message: `Le damos la bienvenida ${infoUser.username}`,
                        token: userToken
                    })

                })
            }else{
                res.json({
                    ok: false,
                    message: "Email/contraseña no son correctos"
                })
            }
        }else{
            res.json({
                ok: false,
                message: "Email/contraseña no son correctos"
            })
        }
    })
})

module.exports = router