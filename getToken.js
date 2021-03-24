function getToken(req, res){

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
            global.access_token = response.data.access_token
            global.user_id = response.data.user_id
            global.refresh_token = response.data.refresh_token

            console.log('Token Obtido:' + response.data.access_token)
      })
      .catch(err => console.warn(err));
}

function getPedidos()
{
    console.log('Importando pedidos: ' + global.access_token + ' - ' + global.user_id)

    global.access_token = 'APP_USR-8909978435931711-032320-039469b4d7b4ea17f3db1994dad3b547-186585541'
    global.user_id = '186585541'

    if(!global.access_token)
        console.log('Sem Token, interrompendo processo...')

    var axios = require('axios');
    
    axios.get( 
      'https://api.mercadolibre.com/orders/search?seller=' + global.user_id,      
      { headers: { Authorization: `Bearer ${global.access_token}` } }
    ).then(res => {
        console.log(res.data)
    }).catch(console.log);      
}

module.exports = {
    getToken: getToken,
    getPedidos: getPedidos
};

    /*const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('client_id', '8909978435931711');
    params.append('client_secret', 'v6GbWGKASUGmarVRaHIMJ3WCRdjetfNZ');
    params.append('code', code);
    params.append('redirect_uri', 'https://mlivre.herokuapp.com/home');

    

    var config = {
        method: 'post',
        url: 'https://auth.mercadolibre.com.ar/oauth/token',        
        data: data
      };

    axios(config)
      .then(function (response) {
        console.log('ok')
        console.log(response.access_token)        
        console.log(response.data.access_token)        
        console.log(response.body.access_token)        
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {
        console.log('done');
      });  


    /*curl -X POST \
    -H 'accept: application/json' \
    -H 'content-type: application/x-www-form-urlencoded' \
    'https://api.mercadolibre.com/oauth/token' \
    -d 'grant_type=authorization_code' \
    -d 'client_id=$APP_ID' \
    -d 'client_secret=$SECRET_KEY' \
    -d 'code=$SERVER_GENERATED_AUTHORIZATION_CODE' \
    -d 'redirect_uri=$REDIRECT_URI'*/

    /*
    const clienteID = '8909978435931711'    
    const redirectURI = 'https://mlivre.herokuapp.com/home'

    const secretKey = 'v6GbWGKASUGmarVRaHIMJ3WCRdjetfNZ'
    const url = 'http://auth.mercadolivre.com.br/authorization'

    const x = 'https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=' + clienteID + '&redirect_uri=' + redirectURI
    */
