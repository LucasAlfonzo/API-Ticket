const { request, response} = require('express');

const FormData = require('form-data');
const { hacerPeticion,refreshToken } = require('../helpers/hacerPeticion');
const { obtenerAccessToken } = require('../helpers/dbValidator');

const path = 'https://ssdsrl.sdpondemand.manageengine.com/api/v3/requests';

/**
 * Obtener Ticket
 * @param {*} req   Request 
 * @param {*} res   Response
 */
const getTicket = async(req = request, res = response) => {
    //SE EXTRAE LA VARIABLE ID QUE VIENE COMO PARAMETRO EN LA PETICION
    const tokenReturn = await obtenerAccessToken();
    const idTicket = req.params.id;
    let pathTicket = path+`?input_data=%7B%22list_info%22%3A%20%7B%22row_count%22%3A%20100%2C%22search_criteria%22%3A%20%7B%22field%22%3A%20%22display_id%22%2C%22condition%22%3A%20%22is%22%2C%22value%22%3A%20%22${idTicket}%22%7D%7D%7D`;
    let fechaActual = new Date();

    let apiResponseData,
        statusResponse,
        apiResponse,
        config;

    if( !tokenReturn ){
        //FUNCION PARA REFRESCAR EL TOKEN
        const refresh_token = await refreshToken();
        console.log('uso del refresh token');
        //EN CASO DE QUE NO HAYA SIDO CREADO EL TOKEN, SE MANDA UN SERVER ERROR
        if( !refresh_token ){   
            return res.status(500).json({
                msg : 'Internal Error(Refresh Token)'
            });
        }else{
            //SE VUELVE A DEFINIR LA VARIABLE CONFIG PARA ENVIAR EN LA PETICION HTTP
            config = {
                url : pathTicket,
                headers : {
                    Authorization : `Bearer ${refresh_token}`,
                    Accept : 'application/v3+json'
                },
            };
            apiResponse = await hacerPeticion(config);
            statusResponse = apiResponse.status;
            apiResponseData = apiResponse.apiResponseData;
            
            if( apiResponse.status == 401 ){
                return res.status(500).json({
                    msg : 'Internal Error'
                });
            }else if( apiResponse.status == 404 ){
                return res.status(404).json({
                    msg : 'No Encontrado',
                    status : statusResponse
                });
            }else if( apiResponse.status == 400 ){
                return res.status(400).json({
                    msg : 'Bad Request'
                });
            }
        }
    }else{
        //EN CASO DE QUE EL TOKEN EXTRAIDO DE LA BD NO EXPIRÓ
        const token = tokenReturn.dataValues.token;
        if( fechaActual < tokenReturn.dataValues.expirationDate ){
            console.log('Token extraido correctamente');
            //VARIABLE PARA MANDAR EL HEADER A LA PETICION HTTP
            let config = {
                url : pathTicket,
                headers : {
                    Authorization : `Bearer ${token}`,
                    Accept : 'application/v3+json'
                },
            };
            apiResponse = await hacerPeticion(config);
            statusResponse = apiResponse.status;
            apiResponseData = apiResponse.apiResponseData;
            if(  apiResponse.status == 400 ){
                return res.status(400).json({
                    status : statusResponse,
                    msg : 'Bad Request'
                });
            }
            //EN EL CASO DE QUE NO ENCUENTRE EL ID DADO, SE RESPONDE CON UN STATUS 404 NOT FOUND
            else if(apiResponse.status == 404){
                return res.status(404).json({
                    status : statusResponse,
                    msg : 'Not Found'
                });
            } else if( apiResponse.status == 401 ){
                return res.status(500).json({
                    status : 500,
                    msg : 'Internal Error(Access Token)'
                });
            } else if( apiResponseData.list_info.row_count === 0 ){
                return res.status(404).json({
                    status : 400,
                    msg : 'Not Found'
                });
            }
        }else {
            console.log('Token expirado');
            //FUNCION PARA REFRESCAR EL TOKEN
            const refresh_token = await refreshToken();
            //EN CASO DE QUE NO HAYA SIDO CREADO EL TOKEN, SE MANDA UN SERVER ERROR
            if( !refresh_token ){   
                return res.status(500).json({
                    msg : 'Internal Error(Refresh Token)'
                });
            }else{
                //SE VUELVE A DEFINIR LA VARIABLE CONFIG PARA ENVIAR EN LA PETICION HTTP
                config = {
                    url : pathTicket,
                    headers : {
                        Authorization : `Bearer ${refresh_token}`,
                        Accept : 'application/v3+json'
                    },
                };
                apiResponse = await hacerPeticion(config);
                statusResponse = apiResponse.status;
                apiResponseData = apiResponse.apiResponseData;
                if( apiResponse.status == 401 ){
                    return res.status(500).json({
                        msg : 'Internal Error'
                    });
                }else if( apiResponse.status == 404 ){
                    return res.status(404).json({
                        msg : 'No Encontrado',
                        status : statusResponse
                    });
                }else if( apiResponse.status == 400 ){
                    return res.status(400).json({
                        msg : 'Bad Request'
                    });
                }
            }
        }

    }
    
    if( statusResponse != 200 ){
        res.status(statusResponse).json({
            status: statusResponse,
            msg : 'Error'
        });
    }else{
        apiResponseData.requests = apiResponseData.requests[0];
        res.json({
            statusResponse,
            apiResponseData
        });
    }
}

/**
 * Obtener Ticket
 * @param {*} req   Request 
 * @param {*} res   Response
 */
const getTicketLong = async(req = request, res = response) => {
    //SE EXTRAE LA VARIABLE ID QUE VIENE COMO PARAMETRO EN LA PETICION
    const tokenReturn = await obtenerAccessToken();
    const idTicket = req.params.id;
    let pathTicket = `${path}/${idTicket}`;
    let fechaActual = new Date();

    let apiResponseData,
        statusResponse,
        apiResponse,
        config;

    if( !tokenReturn ){
        //FUNCION PARA REFRESCAR EL TOKEN
        const refresh_token = await refreshToken();
        console.log('uso del refresh token');
        //EN CASO DE QUE NO HAYA SIDO CREADO EL TOKEN, SE MANDA UN SERVER ERROR
        if( !refresh_token ){   
            return res.status(500).json({
                msg : 'Internal Error(Refresh Token)'
            });
        }else{
            //SE VUELVE A DEFINIR LA VARIABLE CONFIG PARA ENVIAR EN LA PETICION HTTP
            config = {
                url : pathTicket,
                headers : {
                    Authorization : `Bearer ${refresh_token}`,
                    Accept : 'application/v3+json'
                },
            };
            apiResponse = await hacerPeticion(config);
            statusResponse = apiResponse.status;
            apiResponseData = apiResponse.apiResponseData;
            
            if( apiResponse.status == 401 ){
                return res.status(500).json({
                    msg : 'Internal Error'
                });
            }else if( apiResponse.status == 404 ){
                return res.status(404).json({
                    msg : 'No Encontrado',
                    status : statusResponse
                });
            }else if( apiResponse.status == 400 ){
                return res.status(400).json({
                    msg : 'Bad Request'
                });
            }
        }
    }else{
        //EN CASO DE QUE EL TOKEN EXTRAIDO DE LA BD NO EXPIRÓ
        const token = tokenReturn.dataValues.token;
        if( fechaActual < tokenReturn.dataValues.expirationDate ){
            console.log('Token extraido correctamente');
            //VARIABLE PARA MANDAR EL HEADER A LA PETICION HTTP
            let config = {
                url : pathTicket,
                headers : {
                    Authorization : `Bearer ${token}`,
                    Accept : 'application/v3+json'
                },
            };
            apiResponse = await hacerPeticion(config);
            statusResponse = apiResponse.status;
            apiResponseData = apiResponse.apiResponseData;

            //EN EL CASO DE QUE NO ENCUENTRE EL ID DADO, SE RESPONDE CON UN STATUS 404 NOT FOUND
            if(apiResponse.status == 404){
                return res.status(404).json({
                    status : statusResponse,
                    msg : 'Not Found'
                });
            } else if( apiResponse.status == 401 ){
                return res.status(500).json({
                    status : 500,
                    msg : 'Internal Error(Access Token)'
                });
            } else if( apiResponse.status == 400 ){
                return res.status(400).json({
                    status : statusResponse,
                    msg : 'Bad Request'
                });
            }
        }
        //EN CASO DE QUE EL TOKEN EXTRAIDO DE LA BD YA HAYA EXPIRADO
        else {
            console.log('Token expirado');
            //FUNCION PARA REFRESCAR EL TOKEN
            const refresh_token = await refreshToken();
            //EN CASO DE QUE NO HAYA SIDO CREADO EL TOKEN, SE MANDA UN SERVER ERROR
            if( !refresh_token ){   
                return res.status(500).json({
                    msg : 'Internal Error(Refresh Token)'
                });
            }else{
                //SE VUELVE A DEFINIR LA VARIABLE CONFIG PARA ENVIAR EN LA PETICION HTTP
                config = {
                    url : pathTicket,
                    headers : {
                        Authorization : `Bearer ${refresh_token}`,
                        Accept : 'application/v3+json'
                    },
                };
                apiResponse = await hacerPeticion(config);
                statusResponse = apiResponse.status;
                apiResponseData = apiResponse.apiResponseData;
                if( apiResponse.status == 401 ){
                    return res.status(500).json({
                        msg : 'Internal Error'
                    });
                }else if( apiResponse.status == 404 ){
                    return res.status(404).json({
                        msg : 'No Encontrado',
                        status : statusResponse
                    });
                }else if( apiResponse.status == 400 ){
                    return res.status(400).json({
                        msg : 'Bad Request'
                    });
                }
            }
        }

    }
    
    if( statusResponse != 200 ){
        res.status(statusResponse).json({
            status: statusResponse,
            msg : 'Error'
        });
    }else{
        res.json({
            statusResponse,
            apiResponseData
        });
    }
}



/**
 * Modificar Ticket
 * @param {*} req   Request
 * @param {*} res   Response
 */
const putTicket = async(req = request, res = response) => {
    const tokenReturn = await obtenerAccessToken();
    
    const idTicket = req.params.id;
    const pathTicket = path + '/' + idTicket;
    const body = req.body;
    
    let fechaActual = new Date();

    let apiResponseData,
        statusResponse,
        apiResponse,
        config,
        data;
    
    if( !tokenReturn ){
        //FUNCION PARA REFRESCAR EL TOKEN
        const refresh_token = await refreshToken();
        //EN CASO DE QUE NO HAYA SIDO CREADO EL TOKEN, SE MANDA UN SERVER ERROR
        if( !refresh_token ){
            return res.status(500).json({
                msg : 'Internal Error(Refresh Token)'
            });
        }else{
            //SE VUELVE A DEFINIR LA VARIABLE CONFIG PARA ENVIAR EN LA PETICION HTTP
            data = new FormData();
            data.append('input_data', JSON.stringify(body) );
            config = {
                method: 'put',
                url: pathTicket,
                headers: { 
                    'Accept': 'application/vnd.manageengine.sdp.v3+json', 
                    'Authorization': `Bearer ${refresh_token}`,
                    ...data.getHeaders()
                },
                data : data
            };
            //HACE LA CONSULTA HTTP MEDIANTE AXIOS
            apiResponse = await hacerPeticion(config);
            statusResponse = apiResponse.status;
            apiResponseData = apiResponse.apiResponseData;
            //SI VUELVE A DAR ERROR DE AUTORIZACION ES PORQUE ALGO ESTA MAL EN EL CODIGO
            if( statusResponse == 401 ){    
                return res.status(500).json({
                    msg : 'Internal Error'
                });
            }
            //SE EMITE UN MENSAJE DE NO ENCONTRADO EN EL CASO DE DAR UN ERROR 404
            else if( statusResponse == 404 ){  
                return res.status(404).json({
                    msg : 'No Encontrado'
                });
            } 
            //SE EMITE UN MENSAJE DE BAD REQUEST EN EL CASO DE DAR UN ERROR 400
            else if( statusResponse == 400 ){
                return res.status(400).json({
                    msg : 'Bad Request'
                });
            }
        }
    }else{
        const token = tokenReturn.dataValues.token;
        if( fechaActual < tokenReturn.dataValues.expirationDate ){
            console.log('Token extraido correctamente');
            data = new FormData();
            data.append('input_data', JSON.stringify(body) );
            config = {
                method: 'put',
                url: pathTicket,
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
                    msg : 'Internal Error(Access Token)'
                });
            } else if( apiResponse.status == 400 ){
                return res.status(400).json({
                    status : statusResponse,
                    msg : 'Bad Request'
                })
            }
        } else {
            console.log('Token generado correctamente');
            //FUNCION PARA REFRESCAR EL TOKEN
            const refresh_token = await refreshToken();
            //EN CASO DE QUE NO HAYA SIDO CREADO EL TOKEN, SE MANDA UN SERVER ERROR
            if( !refresh_token ){   
                return res.status(500).json({
                    msg : 'Internal Error(Refresh Token)'
                });
            }else{
                //SE VUELVE A DEFINIR LA VARIABLE CONFIG PARA ENVIAR EN LA PETICION HTTP
                data = new FormData();
                data.append('input_data', JSON.stringify(body) );
                config = {
                    method: 'put',
                    url: pathTicket,
                    headers: { 
                        'Accept': 'application/vnd.manageengine.sdp.v3+json', 
                        'Authorization': `Bearer ${refresh_token}`,
                        ...data.getHeaders()
                    },
                    data : data
                };
                //HACE LA CONSULTA HTTP MEDIANTE AXIOS
                apiResponse = await hacerPeticion(config);
                statusResponse = apiResponse.status;
                apiResponseData = apiResponse.apiResponseData;
                //SI VUELVE A DAR ERROR DE AUTORIZACION ES PORQUE ALGO ESTA MAL EN EL CODIGO
                if( statusResponse == 401 ){    
                    return res.status(500).json({
                        msg : 'Internal Error'
                    });
                }
                //SE EMITE UN MENSAJE DE NO ENCONTRADO EN EL CASO DE DAR UN ERROR 404
                else if( statusResponse == 404 ){  
                    return res.status(404).json({
                        msg : 'No Encontrado'
                    });
                } 
                //SE EMITE UN MENSAJE DE BAD REQUEST EN EL CASO DE DAR UN ERROR 400
                else if( statusResponse == 400 ){
                    return res.status(400).json({
                        msg : 'Bad Request'
                    });
                }
            }
        }

    }
    res.json({
        statusResponse,
        apiResponseData
    });
}


/**
 * Crear Ticket
 * @param {*} req   Request
 * @param {*} res   Response
 */
const postTicket = async(req = request, res = response) => {
    const tokenReturn = await obtenerAccessToken();
    const body = req.body;
    body.request.request_type = {
        "name" : "Incident",
        "id" : "180924000000008391"
    }
    let fechaActual = new Date();
    let apiResponseData,
        statusResponse,
        apiResponse,
        data,
        config;
    if( !tokenReturn ){
        console.log('Primer Token');
        const refresh_token = await refreshToken();
            //EN CASO DE QUE NO HAYA SIDO CREADO EL TOKEN, SE MANDA UN SERVER ERROR
            if( !refresh_token ){   
                return resizeTo.status(500).json({
                    msg : 'SERVER ERROR(REFRESH TOKEN PROBLEM)'
                });
            }else{
                //SE VUELVE A DEFINIR LA VARIABLE CONFIG PARA ENVIAR EN LA PETICION HTTP
                data = new FormData();
                data.append('input_data', JSON.stringify(body) );
                config = {
                    method: 'post',
                    url: path,
                    headers: { 
                        'Accept': 'application/vnd.manageengine.sdp.v3+json', 
                        // 'Content-Type': 'application/x-www-form-urlencoded', 
                        'Authorization': `Bearer ${refresh_token}`,
                        ...data.getHeaders()
                    },
                    data : data
                };
                //HACE LA CONSULTA HTTP MEDIANTE AXIOS
                apiResponse = await hacerPeticion(config);
                
                statusResponse = apiResponse.status;
                apiResponseData = apiResponse.apiResponseData;
                if( statusResponse == 401 ){    //SI VUELVE A DAR ERROR DE AUTORIZACION ES PORQUE ALGO ESTA MAL EN EL CODIGO
                    return res.status(500).json({
                        msg : 'Internal Error(Refrehs Token)'
                    });
                }else if( statusResponse == 404 ){  //SE EMITE UN MENSAJE DE NO ENCONTRADO EN EL CASO DE DAR UN ERROR 404
                    return res.status(404).json({
                        msg : 'No Encontrado'
                    });
                } else if( statusResponse == 400 ){
                    return res.status(400).json({
                        msg : 'Bad Request'
                    });
                }
            }
    }else{
        const token = tokenReturn.dataValues.token;
        if( fechaActual < tokenReturn.dataValues.expirationDate ){
            console.log('Token extraido correctamente');
            data = new FormData();
            data.append('input_data', JSON.stringify(body) );
            config = {
                method: 'post',
                url: path,
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
    
            if(statusResponse == 401){
                return res.status(500).json({
                    status : 500,
                    msg : 'Internal Error(Access Token)'
                });
            } else if( apiResponse.status == 404 ){
                return res.status(404).json({
                    msg : 'No Encontrado',
                    status : statusResponse
                });
            }else if( apiResponse.status == 400 ){
                return res.status(400).json({
                    msg : 'Bad Request'
                });
            }
        } else{
            console.log('Token Generado');
            //FUNCION PARA REFRESCAR EL TOKEN
            const refresh_token = await refreshToken();
            //EN CASO DE QUE NO HAYA SIDO CREADO EL TOKEN, SE MANDA UN SERVER ERROR
            if( !refresh_token ){   
                return resizeTo.status(500).json({
                    msg : 'SERVER ERROR(REFRESH TOKEN PROBLEM)'
                });
            }else{
                //SE VUELVE A DEFINIR LA VARIABLE CONFIG PARA ENVIAR EN LA PETICION HTTP
                data = new FormData();
                data.append('input_data', JSON.stringify(body) );
                config = {
                    method: 'post',
                    url: path,
                    headers: { 
                        'Accept': 'application/vnd.manageengine.sdp.v3+json', 
                        // 'Content-Type': 'application/x-www-form-urlencoded', 
                        'Authorization': `Bearer ${refresh_token}`,
                        ...data.getHeaders()
                    },
                    data : data
                };
                //HACE LA CONSULTA HTTP MEDIANTE AXIOS
                apiResponse = await hacerPeticion(config);
                statusResponse = apiResponse.status;
                apiResponseData = apiResponse.apiResponseData;
                if( statusResponse == 401 ){    //SI VUELVE A DAR ERROR DE AUTORIZACION ES PORQUE ALGO ESTA MAL EN EL CODIGO
                    return res.status(500).json({
                        msg : 'Internal Error(Refrehs Token)'
                    });
                }else if( statusResponse == 404 ){  //SE EMITE UN MENSAJE DE NO ENCONTRADO EN EL CASO DE DAR UN ERROR 404
                    return res.status(404).json({
                        msg : 'No Encontrado'
                    });
                } else if( statusResponse == 400 ){
                    return res.status(400).json({
                        msg : 'Bad Request'
                    });
                }
            }
        }
    }



    


    res.json({
        statusResponse,
        apiResponseData
    });
}


module.exports = {
    getTicket,
    putTicket,
    postTicket,
    getTicketLong
}