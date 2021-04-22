const { executeSQL } = require("./bancoDeDados")

async function getP(parametro)
{    
    try{
        const res = await executeSQL(`select valor from CC_ParametrosCustomizados where parametro = '` + parametro + `'`)     
        if(res.recordset)
            return res.recordset[0].valor
        else
            return ''
    }
    catch(err)
    {        
        return undefined
    }
}

async function setP(parametro, valor)
{
    try{
        const res = await executeSQL(`
            if(not exists(select id from CC_ParametrosCustomizados where parametro = '${parametro}'))
                INSERT INTO dbo.CC_ParametrosCustomizados ( parametro , valor ) VALUES ('${parametro}', '${valor}')
            else
                update CC_ParametrosCustomizados set valor = '${valor}' where parametro = '${parametro}'        
        `)
        return true
    }
    catch(err)
    {
        return false
    }
}

module.exports = {
    setP: setP, 
    getP: getP   
};