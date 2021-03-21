const express = require('express');
const cors = require('cors');
const { Console } = require('console');
const bodyParser = require('body-parser');
const getToken = require('./getToken');
const app = express();

app.use(bodyParser.json());
app.use(cors());

app.post('/home', (req, res) => { getToken.getToken(req, res) })


app.listen(process.env.PORT, () =>{
    console.log('App listening on port ' + process.env.PORT);
})
