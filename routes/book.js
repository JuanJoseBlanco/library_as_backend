const { Router } = require('express')
const con = require('../models/connection')
const verifyToken = require('../middlewares/authentication')

const router = Router()

// Creación de libro
router.post('', verifyToken, (req, res) => {
    console.log(req.body);
    const book = {
        title: req.body.title,
        gender: req.body.gender,
        sinopsis: req.body.sinopsis || '',
        stock: req.body.stock || 1
    }

    let sql = `INSERT INTO books (title, gender, sinopsis, stock) VALUES ('${book.title}', '${book.gender}', '${book.sinopsis}', ${book.stock})`
    con.query(sql, (err, result) => {
        if (err){
            res.json({
                ok: false,
                message: 'Ocurrió un error durante la inserción, por favor inténtelo nuevamente'
            })
        }else{
            console.log('Book created sucessfully');
            res.json({
                ok: true,
                message: 'El libro se ha registrado exitosamente'
            })
        }
    })
})

// Lectura de libro por id
router.get('/:id', verifyToken, (req, res) => {
    let sql = `SELECT * FROM books WHERE id = ${req.params.id}`
    con.query(sql, (err, result) => {
        if (err){
            res.json({
                ok: false,
                message: 'Ocurrió un error durante la lectura, por favor inténtelo nuevamente'
            })
        }else{
            res.json({
                ok: true,
                result
            })
        }
    })
})

// Lectura de todos los libros
router.get('', verifyToken, (req, res) => {
    let sql = `SELECT DISTINCT(title), gender, sinopsis, stock FROM books`
    con.query(sql, (err, result) => {
        if (err){
            res.json({
                ok: false,
                message: 'Ocurrió un error durante la lectura, por favor inténtelo nuevamente'
            })
            throw err
        }else{
            res.json({
                ok: true,
                result
            })
        }
    })
})

router.put('/:id', verifyToken, (req, res)=>{
    let sql = `SELECT * FROM books WHERE id = ${req.params.id}`
    con.query(sql, (err, result) => {
        if (err){
            res.json({
                ok: false,
                message: 'Ocurrió un error durante la lectura, por favor inténtelo nuevamente'
            })
        }else{
            resultBook = result[0]
            let newValue = {
                title: req.body.title || resultBook.title,
                gender: req.body.gender || resultBook.gender,
                sinopsis: req.body.sinopsis || resultBook.sinopsis,
                stock: req.body.stock || resultBook.stock
            }
            let update = `UPDATE books SET title = '${newValue.title}', gender = '${newValue.gender}', sinopsis = '${newValue.sinopsis}', stock = ${newValue.stock} WHERE id = ${req.params.id}`;
            con.query(update, (err, resUpdate) => {
                if(err){
                    res.json({
                        ok: false,
                        message: 'Ocurrió un error durante la actualización, por favor inténtelo nuevamente'
                    })
                }else {
                    res.json({
                        ok: true,
                        message: 'Los datos se han actualizado con éxito'
                    })
                }
            })
        }
    })
})

router.delete('/:id', (req, res) => {
    let sql = `DELETE FROM books WHERE id = ${req.params.id}`
    con.query(sql, (err, result) => {
        if(err){
            res.json({
                ok: false,
                message: 'Ocurrió un error durante la eliminación, por favor inténtelo nuevamente'
            })
        }else{
            res.json({
                ok: true,
                message: 'Registro eliminado con éxito'
            })
        }
    })
})


module.exports = router
