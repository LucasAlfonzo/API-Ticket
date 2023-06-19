// const {Pool} = require('pg');
// const pool = new Pool({
//     user : 'postgres',
//     password : 'Lalfonzossd11',
//     host : 'localhost',
//     database : 'SSDTest',
//     port : 5432
// });
const Usuario = require('../models/user');
const Token = require('../models/token');


const autenticarUsuario = async( correo , pass ) =>{
    const usuario = await obtenerUsuario( correo , pass );
    try {
        if( !usuario ){
            return false;
        }else{
            return true;
        }
    } catch (error) {
        console.log(error);
    }
};

const obtenerUsuario = async( correo , pass ) => {
    const usuario = Usuario.findOne({
        where : {
            correo : correo,
            contraseña : pass
        }
    });
    if( !usuario ){
        return null;
    }else{
        return usuario;
    }
}

const obtenerAccessToken = async(  ) =>{
    const token = await Token.findAll({
        where : {
            type : 'access_token'
        }
    });
    if( !token ){
        return null;
    }else{
        return token[token.length-1];
    }
}

const obtenerRefreshToken = async(  )=>{
    const token = await Token.findOne({
        where:{
            type : 'refresh_token'
        }
    });
    if( !token ){
        return null;
    }else{
        return token;
    }
}

const guardarEnBd = async( token ) =>{
    
    let fechaActual = new Date();
    fechaActual.setSeconds(fechaActual.getSeconds() + 3600);
    // fechaActual = fechaActual.toLocaleString();
    const tokens = await Token.create({
        token : token,
        type : 'access_token',
        expirationDate : fechaActual,
    });
    if( !tokens ){
        throw new Error('No se pudo agregar a la base de datos');
    }
}

module.exports = {
    autenticarUsuario,
    obtenerUsuario,
    obtenerAccessToken,
    obtenerRefreshToken,
    guardarEnBd
}