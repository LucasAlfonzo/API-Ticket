const { DataTypes } = require('sequelize');
const {sq} = require('../db/config');

const Token = sq.define('tokens',
{
    token:{
        type : DataTypes.STRING,
        allowNull : false,
    },
    type:{
        type : DataTypes.STRING,
        allowNull : false
    },
    expirationDate : {
        type : DataTypes.DATE,
        allowNull : false
    },
    updatedAt : {
        type : DataTypes.DATE
    },
    createdAt : {
        type : DataTypes.DATE
    }
},
{
    timestamps : true,
    underscored : true,
    tableName : 'tokens'
}
);

Token.sync().then( () =>{
    console.log('Token Model synced');
});

module.exports = Token;
