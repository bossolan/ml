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

//console.log(process.env.PORT)
//global.access_token = 'APP_USR-8909978435931711-040620-111e06694691583e77567e112b2404be-186585541'
//global.user_id = '186585541'

/*getPedido('4460303318')
setTimeout(function(){ getPedido('4463348265') }, 3000); 
setTimeout(function(){ getPedido('4460778724') }, 6000); 
setTimeout(function(){ getPedido('4463341186') }, 9000); 
setTimeout(function(){ getPedido('4463348265') }, 12000); 
setTimeout(function(){ getPedido('4462392293') }, 15000); 
setTimeout(function(){ getPedido('4463600512') }, 18000); 
setTimeout(function(){ getPedido('4460307034') }, 21000); 
*/
//getPedido('4460307034')
//setTimeout(function(){ getPedidos() }, 25000); 
//getPedidos()

cron.schedule("*/30 * * * *", () => { console.log("Executando a tarefa a cada 30 minuto"); getPedidos()} );

app.listen(process.env.PORT || 3030, () =>{
    console.log('App listening on port ' + (process.env.PORT || 3030));
})

