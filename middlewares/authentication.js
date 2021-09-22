const Token = require('../models/token')
const token = new Token()

const verifyToken = (req, res, next) => {
    const userToken = req.get('x-token') || '';
    token.checkToken(userToken)
    .then((decoded) => {
        req.user = decoded.user;
        next()
    })
    .catch( err => {
        res.json({
            ok: false,
            message: 'Token no es correcto'
        })
    })
}

module.exports = verifyToken