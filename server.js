const express = require('express');
const cors = require('cors');
const { Console } = require('console');
const bodyParser = require('body-parser');
const app = express();


app.use(bodyParser.json());
app.use(cors());

app.get('/get', (req, res) => { solicitarToken(req, res) })

const solicitarToken = (req, res) => {

    const clienteID = '8909978435931711'    
    const redirectURI = 'https://mlivre.herokuapp.com/home'

    const secretKey = 'v6GbWGKASUGmarVRaHIMJ3WCRdjetfNZ'
    const url = 'http://auth.mercadolivre.com.br/authorization'

    const x = 'https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=' + clienteID + '&redirect_uri=' + redirectURI

    var data = new FormData();
    data.append('grant_type', 'authorization_code');
    data.append('client_id', clienteID);
    data.append('redirect_uri', redirectURI);
    data.append('response_type', 'code');

    var config = {
        method: 'post',
        url: redirectURI,
        headers: {
            'Accept': 'application/json',            
            ...data.getHeaders()
        },
        data: data
    };

    axios(config)
        .then(function (response) {
            console.log('teste')
        })
        .catch(function (error) {
            res.status(200).send({ status: 'error', message: 'Erro getMelhorEnvio solicitarTokenP1 API' });
        });
}


app.listen(3020, () =>{
    console.log('App listening on port ' + 3020);
})
