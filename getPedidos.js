const { gravaPedido } = require("./gravaPedido");
const { getP, setP } = require("./parametros");

async function getPedidos(auxDias)
{    
    var axios = require('axios');

    const access_token = await getP('ml_access_token')
    const user_id = await getP('ml_user_id')

    console.log('Importando pedidos: ' + access_token + ' - ' + user_id)        

    if(!auxDias)
        auxDias = 1

    var data = new Date();    
    data.setDate(data.getDate() - auxDias);
    var dataStr = data.toISOString().slice(0, -1) + '-00:00'

    var data2 = new Date()
    data2.setDate(data2.getDate() - (auxDias -1));
    var dataStr2 = data2.toISOString().slice(0, -1) + '-00:00'

    if(!access_token)
        console.log('Sem Token, interrompendo processo...')    

    let strGet = 'https://api.mercadolibre.com/orders/search?seller=' + user_id + '&order.status=paid&sort=date_desc&order.date_closed.from=' + dataStr + '&order.date_closed.to=' + dataStr2
    if(auxDias === 1)
        strGet = 'https://api.mercadolibre.com/orders/search?seller=' + user_id + '&order.status=paid&sort=date_desc&order.date_closed.from=' + dataStr
    
    axios.get( 
      strGet,      
      { headers: { Authorization: `Bearer ${access_token}` } }
    ).then(async res => {        
        for(const pedido of res.data.results) {
            console.log(pedido.id) 
            const ret = await gravaPedido(pedido).catch(error => console.log(error))                                
        }
        console.log('Fim')        
    }).catch(console.log);      
}

async function getPedido(pedido)
{    
    var axios = require('axios');

    const access_token = await getP('ml_access_token')
    const user_id = await getP('ml_user_id')

    console.log('Importando pedidos: ' + access_token + ' - ' + user_id)

    var data = new Date();    
    data.setDate(data.getDate() - 1);
    var dataStr = data.toISOString().slice(0, -1) + '-00:00'

    if(!access_token)
        console.log('Sem Token, interrompendo processo...')    
    
    axios.get( 
      `https://api.mercadolibre.com/orders/${pedido}`,      
      { headers: { Authorization: `Bearer ${access_token}` } }
    ).then(async res => {        
            console.log(res.data.id) 
            const ret = await gravaPedido(res.data).catch(error => console.log(error))
            console.log('Fim')        
    }).catch(console.log);          
}


module.exports = {
    getPedidos: getPedidos, 
    getPedido: getPedido   
};