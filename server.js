const cron = require("node-cron");
const express = require('express');
const cors = require('cors');
const { Console } = require('console');
const bodyParser = require('body-parser');
const getToken = require('./getToken');
const { getPedidos, getPedido } = require("./getPedidos");

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/home', (req, res) => { getToken.getToken(req, res, app) })

app.get('/tokenCode', (req, res) => { getTokenCode.getTokenCode(req, res) })

console.log(process.env.PORT)

//global.access_token = 'APP_USR-8909978435931711-040111-f9986bfcc78380b82f5074d03c864ba6-186585541'
//global.user_id = '186585541'

//getPedido('4460778724')
//getPedido('4463341186')
//getPedido('4460303318')
//getPedido('4460307034')
//getPedido('4463348265')
//getPedido('4462392293')

//getPedidos() 

setTimeout(function(){ getPedidos() }, 20000); 
cron.schedule("*/30 * * * *", () => { console.log("Executando a tarefa a cada 30 minuto"); getPedidos()} );

app.listen(process.env.PORT || 3030, () =>{
    console.log('App listening on port ' + (process.env.PORT || 3030));
})

