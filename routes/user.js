const { Router } = require('express')
const verifyToken = require('../middlewares/authentication')

const router = Router()

router.post('/user', verifyToken, (req, res)=>{
    console.log('Entrando');
    console.log(req.user);
    res.json({
        ok: true
    })
})

module.exports = router