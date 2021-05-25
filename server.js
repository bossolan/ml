const cron = require("node-cron");
const express = require('express');
const cors = require('cors');
const { Console } = require('console');
const bodyParser = require('body-parser');
const {getToken, refreshToken} = require('./getToken');
const { getPedidos, getPedido } = require("./getPedidos");
const { setP, getP } = require("./parametros");

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/home', (req, res) => { getToken(req, res, app) })

//console.log(process.env.PORT)
//setP('ml_access_token','APP_USR-8909978435931711-042211-17452b135256d1cce9809c4cb6ab4d73-186585541')
//setP('ml_user_id','186585541')

//getPedido('4571023294')
/*setTimeout(function(){ getPedido('4463348265') }, 3000); 
setTimeout(function(){ getPedido('4460778724') }, 6000); 
setTimeout(function(){ getPedido('4463341186') }, 9000); 
setTimeout(function(){ getPedido('4463348265') }, 12000); 
setTimeout(function(){ getPedido('4462392293') }, 15000); 
setTimeout(function(){ getPedido('4463600512') }, 18000); 
setTimeout(function(){ getPedido('4460307034') }, 21000); 
*/
//getPedido('4460307034')
//setTimeout(function(){ getPedidos() }, 25000); 
//getPedidos(1)
//getPedidos(3)

cron.schedule("*/10 * * * *", () => { console.log("Executando a tarefa a cada 25 minutos"); getPedidos()} );
cron.schedule("0 */2 * * *", () => { console.log("Executando a tarefa a 3 horas"); refreshToken()} );

app.listen(process.env.PORT || 3030, () =>{
    console.log('App listening on port ' + (process.env.PORT || 3030));
})

