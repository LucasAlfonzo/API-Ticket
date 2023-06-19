const { request, response } = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretKey = 'My5eCr3tKE9';
const validarJWT = async( req = request , res = response , next ) =>{
    const token = req.header( 'Authorization' );
    if( !token ){
        return res.status(401).json({
            msg : 'No existe el token en la peticion'
        });
    }
    try {
        //TODO VERIFICAR ERROR EN EL PRIVATEKEY
        const payload = jwt.verify( token , process.env.SECRETORPRIVATEKEY );       
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg : 'Token no válido'
        })
    }
}

module.exports= {
    validarJWT
}