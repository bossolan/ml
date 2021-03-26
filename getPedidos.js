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
    ).then(res => {        
        res.data.results.map(async pedido => {
            console.log(pedido.id) 
            await gravaPedido(pedido).catch(error => console.log(error))                                 
        })
        console.log('Fim')        
    }).catch(console.log);      
}

module.exports = {
    getPedidos: getPedidos,    
};