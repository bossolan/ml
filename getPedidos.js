const { gravaPedido } = require("./gravaPedido");

function getPedidos()
{    
    var axios = require('axios');

    console.log('Importando pedidos: ' + global.access_token + ' - ' + global.user_id)

    global.access_token = 'APP_USR-8909978435931711-032617-3d5d53eb8b74ec32905033de43c4dd05-186585541'
    global.user_id = '186585541'

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