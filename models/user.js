const { DataTypes, Sequelize } = require('sequelize');
const {sq} = require('../db/config');

const Usuario = sq.define('usuario' , {
    nombre : {
        type : DataTypes.STRING
    },
    apellido : {
        type : DataTypes.STRING
    },
    correo : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    id : {
        type : DataTypes.STRING,
        allowNull : false,
        primaryKey : true
    },
    contraseña : {
        type : DataTypes.STRING,
        allowNull : false
    }
},
{
    timestamps : false,
    tableName : 'usuarios'
});

Usuario.sync().then( () => {
    console.log('User Model synced');
});


module.exports = Usuario;