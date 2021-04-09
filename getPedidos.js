const { gravaPedido } = require("./gravaPedido");

function getPedidos()
{    
    var axios = require('axios');

    console.log('Importando pedidos: ' + global.access_token + ' - ' + global.user_id)    

    var data = new Date();    
    data.setDate(data.getDate() - 1);
    var dataStr = data.toISOString().slice(0, -1) + '-00:00'

    if(!global.access_token)
        console.log('Sem Token, interrompendo processo...')    
    
    axios.get( 
      'https://api.mercadolibre.com/orders/search?seller=' + global.user_id + '&order.status=paid&sort=date_desc&order.date_closed.from=' + dataStr,      
      { headers: { Authorization: `Bearer ${global.access_token}` } }
    ).then(async res => {        
        for(const pedido of res.data.results) {
            console.log(pedido.id) 
            const ret = await gravaPedido(pedido).catch(error => console.log(error))                                
        }
        console.log('Fim')        
    }).catch(console.log);      
}

function getPedido(pedido)
{    
    var axios = require('axios');

    console.log('Importando pedidos: ' + global.access_token + ' - ' + global.user_id)

    var data = new Date();    
    data.setDate(data.getDate() - 1);
    var dataStr = data.toISOString().slice(0, -1) + '-00:00'

    if(!global.access_token)
        console.log('Sem Token, interrompendo processo...')    
    
    axios.get( 
      `https://api.mercadolibre.com/orders/${pedido}`,      
      { headers: { Authorization: `Bearer ${global.access_token}` } }
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