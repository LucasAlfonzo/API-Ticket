// const axios = require('axios');
// const bcryptjs = require('bcryptjs');

const {response , request} = require('express');
const { generarJWT } = require('../helpers/generarJWT');
const { autenticarUsuario } = require('../helpers/dbValidator');
// const FormData = require('form-data');
const login = async( req = request , res = response ) =>{
    const body = req.body;
    try {
        const usuario = await autenticarUsuario( body.correo , body.contraseña );
        if( !usuario ){
            return res.status(400).json({
                msg : 'Usuario/Contraseña no son correctos'
            });
        }

        if( usuario.estado == false ){
            return res.status(400).json({
                msg : 'Usuario en false'
            });
        }

        // const validPassword = bcryptjs.compareSync( body.contraseña , usuario.contraseña );
        //TODO: GENERAR EL JWT
        const token = await generarJWT(usuario.id);
        res.json({
            usuario, 
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
}


module.exports = {
    login
}