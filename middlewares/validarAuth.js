const { request, response } = require('express');
const {
    autenticarUsuario
} = require('../helpers/dbValidator');



//BASIC AUTH
const validarAuth = async( req = request , res = response , next ) =>{
    const authHeader = req.header('Authorization');
    if( !authHeader ){
        return res.status(401).json({
            msg : 'Invalid Authorization'
        });
    }
    try {
        const encodedCredentials = authHeader.split(' ')[1];
        console.log(encodedCredentials);
        const credentials = Buffer.from(encodedCredentials,'base64').toString('utf8');
        console.log(credentials);
        const [ username , password ] = credentials.split(':');
        if( ! await autenticarUsuario( username,password ) ){
            return res.status(401).json({
                msg : 'Unauthorized'
            });
        }else{
            next();
        }
    } catch (error) {
        console.log(error);
        return res.status().json({
            msg : 'Error!!'
        });
    }
}
module.exports={
    validarAuth
}