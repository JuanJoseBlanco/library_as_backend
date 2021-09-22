const mysql = require("mysql")

const con = mysql.createConnection({
    host: 'localhost',
    database: 'book-store',
    user: 'root',
    password: ''
})

module.exports = con