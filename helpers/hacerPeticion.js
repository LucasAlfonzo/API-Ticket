const axios = require('axios');
const FormData = require('form-data');
const { obtenerRefreshToken, guardarEnBd } = require('./dbValidator');

const hacerPeticion = async( config ) =>{
    let apiResponse,
        statusResponse;
    try{
        apiResponse = await axios( config )
            .then( response => {
                return response;
            })
            .catch( error => {
                return error;
            });
        // console.log(apiResponse);
    }catch(error){
        console.log(`Error(Request): ${error}`);
    }
    if( !apiResponse.data ){
        statusResponse = apiResponse.response.status;
    }else{
        statusResponse = apiResponse.status;
    };
    return{apiResponseData:apiResponse.data,status:statusResponse};
}

async function refreshToken() {
    const pathRefresh = 'https://accounts.zoho.com/oauth/v2/token'; //RUTA PARA HACER EL REFRESH
    const data = new FormData();
    const payload = await obtenerRefreshToken();
    const refresh_token = payload.token;
    //SET HEADERS 
    // data.append('refresh_token', process.env.REFRESHTOKEN);
    data.append('refresh_token',refresh_token);
    data.append('grant_type', 'refresh_token');
    data.append('client_id', process.env.CLIENTID);
    data.append('client_secret', process.env.CLIENTSECRET);
    data.append('scope', process.env.SCOPE);

    const config = {
        method: 'post',
        url: pathRefresh,
        headers: {
            ...data.getHeaders()
        },
        data: data
    };

    let apiResponse;
    try {
        apiResponse = await axios(config)
            .then(response => {
                return response;
            });
    } catch (error) {
        console.log(error);

    }
    const dataApiResponse = apiResponse.data;
    if (!apiResponse) {
        return undefined;
    }

    let { access_token } = dataApiResponse;
    guardarEnBd(access_token);
    return access_token;
}

module.exports={
    hacerPeticion,
    refreshToken
}