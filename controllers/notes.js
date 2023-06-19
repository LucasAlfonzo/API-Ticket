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
                    // 'Content-Type': 'application/x-www-form-urlencoded', 
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
                    // 'Content-Type': 'application/x-www-form-urlencoded', 
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
                        // 'Content-Type': 'application/x-www-form-urlencoded', 
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

    res.json({
        statusResponse,
        apiResponseData
    });
}


// const postNote2 = async( req = request , res = response) =>{
//     const idTicket = req.params.id;
//     const body = req.body;
//     body.request_note.show_to_requester = true;
//     body.request_note.notify_technician = true;
//     let data = new FormData();
//     data.append('input_data', JSON.stringify(body) );
//     let apiResponseData;
//     let statusResponse;
//     let config = {
//         method: 'post',
//         url: `${path}/${idTicket}/notes`,
//         headers: { 
//             'Accept': 'application/vnd.manageengine.sdp.v3+json', 
//             // 'Content-Type': 'application/x-www-form-urlencoded', 
//             'Authorization': `Bearer ${token}`,
//             ...data.getHeaders()
//         },
//         data : data
//     };
//     let apiResponse = await hacerPeticion( config );
//     statusResponse = apiResponse.status;
//     apiResponseData = apiResponse.apiResponseData;
//     if(statusResponse == 404){
//         return res.status(404).json({
//             status : statusResponse,
//             msg : 'Not Found'
//         });
//     }else if( statusResponse == 401 ){
//         const refresh_token = await refreshToken();//FUNCION PARA REFRESCAR EL TOKEN
//         if( !refresh_token ){   //EN CASO DE QUE NO HAYA SIDO CREADO EL TOKEN, SE MANDA UN SERVER ERROR
//             return resizeTo.status(500).json({
//                 msg : 'SERVER ERROR(REFRESH TOKEN PROBLEM)'
//             });
//         }else{
//             //SE VUELVE A DEFINIR LA VARIABLE CONFIG PARA ENVIAR EN LA PETICION HTTP
//             let data2 = new FormData();
//             data2.append('input_data', JSON.stringify(body) );
            
//             //HACE LA CONSULTA HTTP MEDIANTE AXIOS
//             let pathTicket = path+`?input_data=%7B%22list_info%22%3A%20%7B%22row_count%22%3A%20100%2C%22search_criteria%22%3A%20%7B%22field%22%3A%20%22display_id%22%2C%22condition%22%3A%20%22is%22%2C%22value%22%3A%20%22${idTicket}%22%7D%7D%7D`;
//             let configGetTicket = {
//                 url : pathTicket,
//                 headers : {
//                     Authorization : `Bearer ${refresh_token}`,
//                     Accept : 'application/v3+json'
//                 },
//             };
//             let longTicket;
//             let apiResponseTicket = await hacerPeticion( configGetTicket );
//             if( apiResponseTicket.status != 200 ){
//                 return res.status(apiResponseTicket.status).json({
//                     msg : 'Error al encontrar el id del Ticket'
//                 });
//             }else{
//                 longTicket = apiResponseTicket.apiResponseData.requests[0].id;
//             }
//             config = {
//                 method: 'post',
//                 url: `${path}/${longTicket}/notes`,
//                 headers: { 
//                     'Accept': 'application/vnd.manageengine.sdp.v3+json', 
//                     // 'Content-Type': 'application/x-www-form-urlencoded', 
//                     'Authorization': `Bearer ${refresh_token}`,
//                     ...data.getHeaders()
//                 },
//                 data : data2
//             };
//             apiResponse = await hacerPeticion( config );

//             statusResponse = apiResponse.status;
//             apiResponseData = apiResponse.apiResponseData;
//             if( statusResponse == 401 ){    //SI VUELVE A DAR ERROR DE AUTORIZACION ES PORQUE ALGO ESTA MAL EN EL CODIGO
//                 return res.status(500).json({
//                     msg : 'Internal Error',
//                     status : 500
//                 });
//             }else if( statusResponse == 404 ){  //SE EMITE UN MENSAJE DE NO ENCONTRADO EN EL CASO DE DAR UN ERROR 404
//                 return res.status(404).json({
//                     msg : 'No Encontrado',
//                     status : statusResponse
//                 });
//             }else if( statusResponse == 400 ){
//                 return res.status(400).json({
//                     msg : 'Bad Request',
//                     status: statusResponse
//                 });
//             }
//         }
//     }else if( statusResponse == 400 ){
//         return res.status(400).json({
//             msg : 'Bad Request',
//             status : statusResponse
//         });
//     };

//     res.json({
//         statusResponse,
//         apiResponseData
//     });
// }



module.exports={
    postNote,
    getNote
}
