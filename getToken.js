const { getPedidos } = require("./getPedidos");
const { setP, getP } = require("./parametros");

/******************************************* rotina para obter token do bancotoken *******************************/
async function getToken(req, res){

    console.log(req.query.code);
    const code = req.query.code

    res.status(200).send({ status: 'ok' });

    const axios = require('axios')

    const data = {
        grant_type: 'authorization_code',
        client_id: '8909978435931711',
        client_secret: 'v6GbWGKASUGmarVRaHIMJ3WCRdjetfNZ',
        code: code,
        redirect_uri: 'https://mlivre.herokuapp.com/home'
    }

    axios.post('https://api.mercadolibre.com/oauth/token', null, { params: data})
      .then(response => {
            setP('ml_access_token',response.data.access_token)
            setP('ml_user_id',response.data.user_id)
            setP('ml_refresh_token',response.data.refresh_token)

            console.log('Token Obtido:' + response.data.access_token)            

            if(!global.dataUltimoGetPedidos)
            {
              global.dataUltimoGetPedidos = new Date()
              setTimeout(function(){ global.dataUltimoGetPedidos = undefined }, 1000 * 60 * 5);               
              setTimeout(function(){ getPedidos() }, 1000);              
              setTimeout(function(){ getPedidos(2) }, 15000);              
              setTimeout(function(){ getPedidos(3) }, 30000);
            }
      })
      .catch(err => console.warn(err));
}

async function refreshToken(){

    const axios = require('axios')

    const data = {
        grant_type: 'refresh_token',
        client_id: '8909978435931711',
        client_secret: 'v6GbWGKASUGmarVRaHIMJ3WCRdjetfNZ',        
        refresh_token: await getP('ml_refresh_token')
    }

    axios.post('https://api.mercadolibre.com/oauth/token', null, { params: data})
      .then(response => {
            setP('ml_access_token',response.data.access_token)
            setP('ml_global.user_id',response.data.user_id)
            setP('ml_refresh_token',response.data.refresh_token)

            console.log('Token Refresh:' + response.data.access_token)            
      })
      .catch(err => {
          console.warn(err)
          setTimeout(function(){ refreshToken() }, 1000 * 60 * 5); 
      });
}

module.exports = {
    getToken: getToken,
    refreshToken: refreshToken
};
