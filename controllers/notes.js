const { request, response} = require('express');
const FormData = require('form-data');

const { hacerPeticion,refreshToken } = require('../helpers/hacerPeticion');
const { obtenerAccessToken } = require('../helpers/dbValidator');

const path = 'https://ssdsrl.sdpondemand.manageengine.com/api/v3/requests';

/**
 * 
 */
const postNote = async( req = request , res = response) =>{
    const tokenReturn = await obtenerAccessToken();
    const idTicket = req.params.id;
    req.body.request_note.notify_technician = true;
    const body = req.body;
    let fechaActual = new Date();
    let apiResponseData,
        apiResponse,
        statusResponse,
        config,
        data;
    
    if( !tokenReturn ){
        //FUNCION PARA REFRESCAR EL TOKEN
        const refresh_token = await refreshToken();
        if( !refresh_token ){
            return res.status(500).json({
                msg : 'Internal Error(Refresh Token)'
            });
        }else{
            data = new FormData();
            data.append('input_data', JSON.stringify(body) );
            config = {
                method: 'post',
                url: `${path}/${idTicket}/notes`,
                headers: { 
                    'Accept': 'application/vnd.manageengine.sdp.v3+json', 
                    // 'Content-Type': 'application/x-www-form-urlencoded', 
                    'Authorization': `Bearer ${refresh_token}`,
                    ...data.getHeaders()
                },
                data : data
            };
            apiResponse = await hacerPeticion(config);
            statusResponse = apiResponse.status;
            apiResponseData = apiResponse.apiResponseData;
            if(statusResponse == 404){
                return res.status(404).json({
                    status : statusResponse,
                    msg : 'Not Found'
                });
            }else if( statusResponse == 401 ){    //SI VUELVE A DAR ERROR DE AUTORIZACION ES PORQUE ALGO ESTA MAL EN EL CODIGO
                return res.status(500).json({
                    msg : 'Internal Error',
                    status : 500
                });
            }else if( statusResponse == 400 ){
                return res.status(400).json({
                    msg : 'Bad Request',
                    status: statusResponse
                });
            }
        }
    } else {
        const token = tokenReturn.dataValues.token;
        if( fechaActual < tokenReturn.dataValues.expirationDate ){
            console.log('Token extraido correctamente');
            data = new FormData();
            data.append('input_data', JSON.stringify(body) );
            config = {
                method: 'post',
                url: `${path}/${idTicket}/notes`,
                headers: { 
                    'Accept': 'application/vnd.manageengine.sdp.v3+json', 
                    'Authorization': `Bearer ${token}`,
                    ...data.getHeaders()
                },
                data : data
            };
            apiResponse = await hacerPeticion(config);
            statusResponse = apiResponse.status;
            apiResponseData = apiResponse.apiResponseData;
            if(statusResponse == 404){
                return res.status(404).json({
                    status : statusResponse,
                    msg : 'Not Found'
                });
            } else if( apiResponse.status == 401 ){
                return res.status(500).json({
                    msg : 'Internal Error(Access Token)',
                    status : 500
                });
            } else if( apiResponse.status == 400 ){
                return res.status(400).json({
                    status : statusResponse,
                    msg : 'Bad Request'
                })
            }
        }else{
            console.log('Token generado correctamente');
            const refresh_token = await refreshToken();
            if( !refresh_token ){
                return res.status(500).json({
                    msg : 'Internal Error(Refresh Token)'
                });
            }else{
                data = new FormData();
                data.append('input_data', JSON.stringify(body) );
                config = {
                    method: 'post',
                    url: `${path}/${idTicket}/notes`,
                    headers: { 
                        'Accept': 'application/vnd.manageengine.sdp.v3+json', 
                        'Authorization': `Bearer ${refresh_token}`,
                        ...data.getHeaders()
                    },
                    data : data
                };
                apiResponse = await hacerPeticion(config);
                statusResponse = apiResponse.status;
                apiResponseData = apiResponse.apiResponseData;
                if(statusResponse == 404){
                    return res.status(404).json({
                        status : statusResponse,
                        msg : 'Not Found'
                    });
                } else if( apiResponse.status == 401 ){
                    return res.status(500).json({
                        msg : 'Internal Error(Refresh Token)',
                        status : 500
                    });
                } else if( apiResponse.status == 400 ){
                    return res.status(400).json({
                        status : statusResponse,
                        msg : 'Bad Request'
                    })
                }
            }
        }
    }
    

    res.json({
        statusResponse,
        apiResponseData
    });
}


const getNote = async( req = request , res = response) =>{
    const idTicket = req.params.id;
    const body = req.body;
    
    let apiResponseData,
        apiResponse,
        statusResponse,
        config,
        data;

    let fechaActual = new Date();
    const tokenReturn = await obtenerAccessToken();
    if( !tokenReturn ){
        const refresh_token = await refreshToken();
        if( !refresh_token ){
            res.status(500).json({
                msg : 'Internal Error(Refresh Token)',
                status : 500
            });
        }else{
            data = new FormData();
            data.append('input_data', JSON.stringify(body) );
            config = {
                method: 'get',
                url: `${path}/${idTicket}/notes`,
                headers: { 
                    'Accept': 'application/vnd.manageengine.sdp.v3+json', 
                    // 'Content-Type': 'application/x-www-form-urlencoded', 
                    'Authorization': `Bearer ${refresh_token}`,
                    ...data.getHeaders()
                },
                data : data
            };
            apiResponse = await hacerPeticion( config );
            statusResponse = apiResponse.status;
            apiResponseData = apiResponse.apiResponseData;
            if(statusResponse == 404){
                return res.status(404).json({
                    status : statusResponse,
                    msg : 'Not Found'
                });
            } else if( apiResponse.status == 401 ){
                return res.status(500).json({
                    msg : 'Internal Error(Access Token)',
                    status : 500
                });
            } else if( apiResponse.status == 400 ){
                return res.status(400).json({
                    status : statusResponse,
                    msg : 'Bad Request'
                })
            }
        }
    }else{
        if( fechaActual < tokenReturn.dataValues.expirationDate ){
            const token = tokenReturn.dataValues.token;
            console.log('token extraido correctamente');
            data = new FormData();
            data.append('input_data', JSON.stringify(body) );
            config = {
                method: 'get',
                url: `${path}/${idTicket}/notes`,
                headers: { 
                    'Accept': 'application/vnd.manageengine.sdp.v3+json', 
                    'Authorization': `Bearer ${token}`,
                    ...data.getHeaders()
                },
                data : data
            };
            apiResponse = await hacerPeticion( config );
            statusResponse = apiResponse.status;
            apiResponseData = apiResponse.apiResponseData;
            if(statusResponse === 404){
                return res.status(404).json({
                    status : statusResponse,
                    msg : 'Not Found'
                });
            } else if( apiResponse.status === 401 ){
                return res.status(500).json({
                    msg : 'Internal Error(Access Token)',
                    status : 500
                });
            } else if( apiResponse.status === 400 ){
                return res.status(400).json({
                    status : statusResponse,
                    msg : 'Bad Request'
                })
            }
        }else{
            console.log('Token generado correctamente');
            const refresh_token = await refreshToken();
            if( !refresh_token ){
                res.status(500).json({
                    msg : 'Internal Error(Refresh Token)',
                    status : 500
                });
            }else{
                data = new FormData();
                data.append('input_data', JSON.stringify(body) );
                config = {
                    method: 'get',
                    url: `${path}/${idTicket}/notes`,
                    headers: { 
                        'Accept': 'application/vnd.manageengine.sdp.v3+json', 
                        'Authorization': `Bearer ${refresh_token}`,
                        ...data.getHeaders()
                    },
                    data : data
                };
                apiResponse = await hacerPeticion( config );
                statusResponse = apiResponse.status;
                apiResponseData = apiResponse.apiResponseData;
                if(statusResponse === 404){
                    return res.status(404).json({
                        status : statusResponse,
                        msg : 'Not Found'
                    });
                } else if( apiResponse.status === 401 ){
                    return res.status(500).json({
                        msg : 'Internal Error(Access Token)',
                        status : 500
                    });
                } else if( apiResponse.status === 400 ){
                    return res.status(400).json({
                        status : statusResponse,
                        msg : 'Bad Request'
                    })
                }
            }
        }
    }
    //OBTIENE LA ULTIMA NOTA AGREGADA AL REQUEST
    const lastNote = getLastNote(apiResponseData.notes);
    //VERIFICA SI EXISTE UNA NOTA SOBRE LA REQUEST Y ASIGNA VERDADERO O FALSO DEPENDIENDO SI EXISTE O NO LA NOTA
    const hasNote = lastNote ? true:false;
    res.json({
        statusResponse,
        hasNote,
        lastNote
    });
}

const getLastNote = ( notes ) =>{
    let lastNote=null;
    for( let indice = notes.length - 1 ; indice >= 0 ; indice-- ){
        if( notes[indice].show_to_requester == true ){
            lastNote = notes[indice];
            break;
        }
    };
    return lastNote;
}



module.exports={
    postNote,
    getNote
}
