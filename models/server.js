const express = require('express');
const cors = require('cors');
const { dbConnect } = require('../db/config');

class Server{
    constructor(){

        this.app = express();
        this.port = '8090';
        this.pathTicket = '/api/tickets';
        //DB CONNECTION
        this.dbConnection();

        //MIDDLEWARES
        this.middlewares();

        //RUTAS DE MI APLICACION
        this.routes();
    }

    async dbConnection(){
        await dbConnect();
    }

    middlewares(){
        //CORS
        this.app.use( cors() );
        //LECTURA Y PARSEO DEL BODY
        this.app.use( express.json() );
        //Directorio Publico
        this.app.use( express.static('Public') );
    }

    routes(){
        //ENDPOINTS
        this.app.use( this.pathTicket , require('../routes/ticket') );
    }

    listen(){
        this.app.listen( this.port , () => {
            console.log('Servidor corriendo en el puerto: ', this.port);
        });
    }
}




module.exports = Server;