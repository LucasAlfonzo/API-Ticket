const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize( process.env.DATABASENAME , process.env.USER , process.env.PASS , {
    host : 'localhost',
    dialect : 'postgres'
} );
const dbConnect = async() =>{
    try {
        await sequelize.authenticate();
        console.log('Base de datos online');
    } catch (error) {
        console.log(error);
        throw new Error('Problemas a la hora de conectar a la base de datos' , error );
    }
}

module.exports  = {
    sq : sequelize,
    dbConnect
};