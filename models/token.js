const jwt = require('jsonwebtoken')

class Token {
    constructor(){
        this.seed = 'seed-book-store'
        this.caducity = '30d'
    }

    getJwtToken(payload){
        return jwt.sign({
            user: payload
        }, this.seed, {expiresIn: this.caducity})
    }

    checkToken(userToken){
        return new Promise((res, rej) => {
            jwt.verify(userToken, this.seed, (err, decoded) => {
                if(err){
                    rej()
                }else{
                    res(decoded)
                }
            })
        })
    }
}

module.exports = Token