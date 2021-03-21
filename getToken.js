function getToken(req, res){

    console.log(req.query.code);
    const code = req.query.code

    res.status(200).send({ status: 'ok' });

    const axios = require('axios')

    /*const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('client_id', '8909978435931711');
    params.append('client_secret', 'v6GbWGKASUGmarVRaHIMJ3WCRdjetfNZ');
    params.append('code', code);
    params.append('redirect_uri', 'https://mlivre.herokuapp.com/home');*/

    const data = {
        grant_type: 'authorization_code',
        client_id: '8909978435931711',
        client_secret: 'v6GbWGKASUGmarVRaHIMJ3WCRdjetfNZ',
        code: code,
        redirect_uri: 'https://mlivre.herokuapp.com/home'
    }

    var config = {
        method: 'post',
        url: 'https://auth.mercadolibre.com.ar/oauth/token',        
        data: data
      };

    axios(config)
      .then(function (response) {
        console.log('ok')
        console.log(response.body)        
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

}


module.exports = {
    getToken: getToken
};



 