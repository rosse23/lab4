const jwt = require('jsonwebtoken')
const moment = require('moment')
const config = require('./config')

function isAuth(req,res,next){
    const token = req.headers['token']
    if(!token){return res.status(401).json({message: "Ingrese un token"})}
    try {
        const decod = jwt.verify(token, config.secret)
        if (decod) {
            req.uId = decod.id
            next()
        }
    }catch(err){
        return res.send('El token ya expiro o no es valido')
    }
}
module.exports = isAuth