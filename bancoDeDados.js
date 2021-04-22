const dotenv = require('dotenv');
dotenv.config();

var config = {
    user:  process.env.DB_USER,
    password: process.env.DB_PASS,
    server:  process.env.DB_HOST, 
    port:  Number(process.env.DB_PORT),
    database:  process.env.DB_NAME ,
    options: {
        encrypt: false,
        enableArithAbort: true            
        }
};

async function executeSQL(strSQL){

    var sql = require("mssql");

    await sql.connect(config)

    var request = new sql.Request();    

    var fs = require('fs');
    fs.writeFileSync('./requests.txt', strSQL , 'utf-8');

    return await request.query(strSQL);
}

module.exports = {
    executeSQL: executeSQL
};