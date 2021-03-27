const cron = require("node-cron");
const express = require('express');
const cors = require('cors');
const { Console } = require('console');
const bodyParser = require('body-parser');
const getToken = require('./getToken');
const { getPedidos } = require("./getPedidos");

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/home', (req, res) => { getToken.getToken(req, res, app) })

app.get('/tokenCode', (req, res) => { getTokenCode.getTokenCode(req, res) })

console.log(process.env.PORT)

//getPedidos()

setTimeout(function(){ getPedidos() }, 20000); 
//cron.schedule("*/30 * * * *", () => { console.log("Executando a tarefa a cada 30 minuto"); getPedidos()} );

app.listen(process.env.PORT || 3030, () =>{
    console.log('App listening on port ' + (process.env.PORT || 3030));
})
