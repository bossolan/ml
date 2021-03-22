const express = require('express');
const cors = require('cors');
const { Console } = require('console');
const bodyParser = require('body-parser');
const getToken = require('./getToken');
const getTokenCode = require('./getTokenCode');
const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/home', (req, res) => { getToken.getToken(req, res, app) })

app.get('/tokenCode', (req, res) => { getTokenCode.getTokenCode(req, res) })

app.listen(process.env.PORT || 3030, () =>{
    console.log('App listening on port ' + (process.env.PORT || 3030));
})
