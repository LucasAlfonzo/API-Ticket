const { request , response } = require('express');

const validarBodyPutTicket = ( req = request , res = response , next) =>{
    if( !req.body ){
        return res.status(400).json({
            msg : 'Body is not send',
            status : 400
        });
    }else if( !req.body.request ){
        return res.status(400).json({
            msg : 'Bad Request',
            status : 400
        });
    }
    next();
}

const validarBodyPostTicket = ( req = request , res = response , next) =>{
    if( !req.body ){
        return res.status(400).json({
            msg : 'Body is not send',
            status : 400
        });
        // return new Error()
    }else if( !req.body.request ){
        return res.status(400).json({
            msg : 'Bad Request',
            status : 400
        });
    }else if( !req.body.request.subject ){
        return res.status(400).json({
            msg : 'Subject(Obligatory) not Found',
            status : 400
        });
    }else if( !req.body.request.email_ids_to_notify ){
        return res.status(400).json({
            msg : 'Email(Obligatory) not found',
            status: 400
        });
    }else if( !req.body.request.udf_fields ){
        return res.status(400).json({
            msg : 'Phone(Obligatory) not found',
            status : 400
        });
    }else if( !req.body.request.udf_fields.udf_char2 ){
        return res.status(400).json({
            msg : 'Phone(Obligatory) not found',
            status : 400
        });
    };;
    let punto = /[.]/;
    let arroba = /[@]/;
    if( !punto.test( session.email ) || !arroba.test( session.email ) ){
        return res.status(400).json({
            msg : 'Value given for email is not valid',
            status: '400'
        });
    }
    next();
}

const validarBodyPostNote = ( req = request , res = response , next) =>{
    if( !req.body ){
        return res.status(400).json({
            msg : 'Body is not send',
            status : 400
        });
    }else if( !req.body.request_note ){
        return res.status(400).json({
            msg : 'Bad Request',
            status : 400
        });
    }else if( !req.body.request_note.description ){
        return res.status(400).json({
            msg : 'Description(Obligatory) not Found',
            status : 400
        });
    }
    next();
}

module.exports={
    validarBodyPutTicket,
    validarBodyPostTicket,
    validarBodyPostNote
}