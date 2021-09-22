const express = require('express')
const cors = require('cors')

const con = require('./connection')


class Server {

    constructor(){
        this.app = express()
        this.port = process.env.PORT
        this.userEndpoint = '/api/users'
        this.authEndpoint = '/api/auth'

        //middleware
        this.middlewares()

        this.routes()
        this.connection()
    }

    middlewares(){
        this.app.use(cors())
        this.app.use(express.json())
    }

    routes(){
        this.app.use(this.authEndpoint, require('../routes/auth'))
        this.app.use(this.userEndpoint, require('../routes/user'))
    }

    connection(){
        con.connect((err) => {
            if(err) throw err
            console.log('Connected to database!')
        })
    }

    listen(){
        this.app.listen(this.port, () => console.log(`Servidor corriendo en el puerto ${this.port}`))
    }
}

module.exports = Server