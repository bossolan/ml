const { gravaPedido } = require("./gravaPedido");

function getPedidos()
{    
    var axios = require('axios');

    console.log('Importando pedidos: ' + global.access_token + ' - ' + global.user_id)

    global.access_token = 'APP_USR-8909978435931711-033010-aa0703a6da6bae879dc5def71c38af9b-186585541'
    global.user_id = '186585541'

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

module.exports = {
    getPedidos: getPedidos,    
};