const { Console } = require('console');
const { executeSQL } = require('./bancoDeDados');

var fs = require('fs');

var ceps = []

async function obterDadosFaturamento(pedido)
{
    var axios = require('axios');
    const url = `https://api.mercadolibre.com/orders/${pedido.id}/billing_info`

    const res = await axios.get( 
        url,      
        { headers: { Authorization: `Bearer ${global.access_token}` } }
      ).catch(res => console.log(res.data))

    if(!res)
        return undefined

    return res.data
}

async function obterDadosShip(pedido)
{
    var axios = require('axios');
    const url = `https://api.mercadolibre.com/orders/${pedido.id}/shipments`

    const res = await axios.get( 
        url,      
        { headers: { Authorization: `Bearer ${global.access_token}` } }
      ).catch(res => console.log(res.data))

    if(!res)
        return undefined

    return res.data      
}

async function pedidoExistente(pedido)
{
    const idPagamento = pedido.payments[0].id
    const packID = pedido.pack_id ? pedido.pack_id : '@@@#$@#@@$@#'
    const res = await executeSQL(`select id, numeroDoPedidoDoCliente, obsViaSeparacao from PedidosDeVenda where dataCotacao > getdate() - 60 and (convert(varchar(max),obsViaSeparacao) like '%${packID}%' or convert(varchar(max),obsViaSeparacao) like '%${pedido.id}%')`).catch(console.log)
    
    if(res.recordset[0])
    {
        const obsViaSeparacao = res.recordset[0].obsViaSeparacao
        const idPedidoSistema = res.recordset[0].id
        const numeroDoPedidoDoCliente = res.recordset[0].numeroDoPedidoDoCliente

        if(obsViaSeparacao.toString().includes(pedido.id))
            return true
        else   
        {
            adicionaItens(idPedidoSistema, numeroDoPedidoDoCliente, pedido)
            return true
        }
    }
    else
        return false
}

async function adicionaItens(idPedidoSistema, numeroDoPedidoDoCliente, pedido)
{
    /************ ATUALIZA DATAFAT E SHIP **************/
    const dataFat = await obterDadosFaturamento(pedido).catch(error => console.log(error))
    const dataShip = await obterDadosShip(pedido).catch(error => console.log(error))    

    pedido.dataFat = dataFat
    pedido.dataShip = dataShip

    /************ GRAVA LOGS ************************/
    fs.writeFileSync('./pedido' + pedido.id + '--' + pedido.payments[0].id + '.txt', JSON.stringify(pedido, null, 2) , 'utf-8');

    console.log('Gravando pedido: ' + pedido.id)

    const aux = numeroDoPedidoDoCliente.includes(pedido.payments[0].id) ? '' : ' #' + pedido.payments[0].id

    /************ MONTA INSERTS ***********************/
    let strSQLPedidos = ` 
    set xact_abort on

    declare @idPedido numeric
    select @idPedido = id from PedidosDeVenda where id = ${idPedidoSistema} and status = 'P'

    if(@idPedido is null)
        return

    update PedidosDeVenda set obsViaSeparacao = convert(varchar(max),obsViaSeparacao) + ' ${pedido.id}', numeroDoPedidoDoCliente = numeroDoPedidoDoCliente + ' ${numeroDoPedidoDoCliente}'
    where id = @idPedido
    
    update PedidosDeVendaItens set item = item * 1000 where idPedido = @idPedido
    `

    const freteT = pedido.dataShip.shipping_option.list_cost - pedido.dataShip.shipping_option.cost

    let totAux = 0    
    pedido.order_items.forEach(el => { totAux += el.unit_price * el.quantity });

    await pedido.order_items.forEach(async (el,i) => {
        const freteI = freteT / totAux * (el.unit_price * el.quantity)
        strSQLPedidos += await getSTRSQLPedidoItens(el, i, freteI)    
    });

    const strSQLItenizar = `
    UPDATE dbo.PedidosDeVendaItens SET item = itemx FROM ( 
        SELECT id, ROW_NUMBER() OVER (ORDER BY id) itemx FROM dbo.PedidosDeVendaItens  WHERE idPedido = @idPedido
    ) a WHERE a.id = pedidosdevendaitens.id
    `

    console.log('Inserindo')
    await executeSQL(strSQLPedidos + strSQLItenizar).catch(err => {
        const fs = require('fs');
        console.log('Erro SQL' + err + strSQLPedidos)
        fs.appendFile('message.txt', strSQLPedidos, function (err) {})
    })
}

async function getDadosCidade(cep) {
    cep = cep.replace(/\D/g, '');

    const aux = ceps.find(el => el.cep === cep)
    if(aux)
        return aux

    if (cep.length === 8) {

        var axios = require('axios');
        const url = 'http://viacep.com.br/ws/' + cep + '/json/'
    
        const res = await axios.get(url).catch(console.log)
        if(!res)
            return undefined

        ceps.push({cep: cep, data: res.data})

        return res.data
    }
}

async function getBillingValue(pedido, type)
{
    const v = pedido.dataFat.billing_info.additional_info.find(el => el.type === type)
    if(v)
        return v.value
    else
        return ''
}

async function gravaPedido(pedido)
{
    if(pedido.status !== 'paid')
        return            

    if(await pedidoExistente(pedido))
        return
    
    const dataFat = await obterDadosFaturamento(pedido).catch(error => console.log(error))
    const dataShip = await obterDadosShip(pedido).catch(error => console.log(error))    

    pedido.dataFat = dataFat
    pedido.dataShip = dataShip

    fs.writeFileSync('./pedido' + pedido.id + '--' + pedido.payments[0].id + '.txt', JSON.stringify(pedido, null, 2) , 'utf-8');

    console.log('Gravando pedido: ' + pedido.id)

    if(!pedido.dataShip)
    {
        console.log('Pedido sem dataship:' + pedido.id)
        return
    }
    
    fs.writeFileSync('./pedido' + pedido.id + '--' + pedido.payments[0].id + '.txt', JSON.stringify(pedido, null, 2) , 'utf-8');

    let sale_fee = 0;
    let totAux = 0
    
    pedido.order_items.forEach(el => {
        sale_fee += el.sale_fee 
        totAux += el.unit_price * el.quantity
    });

    const freteT = pedido.dataShip.shipping_option.list_cost - pedido.dataShip.shipping_option.cost
    const outrasDespesasT = sale_fee
    const totalNota = pedido.paid_amount
    const totalProdutos = totalNota - outrasDespesasT - freteT  
    
    const cnpjCPF = pedido.dataFat.billing_info.doc_number

    const ieRG = 'ISENTO'
    let razaoSocial = await getBillingValue(pedido, 'FIRST_NAME') + ' ' + await getBillingValue(pedido, 'LAST_NAME')
    let razaoSocial2 =  await getBillingValue(pedido, 'BUSINESS_NAME')
    let fantasia = pedido.buyer.nickname
    let endereco = await getBillingValue(pedido, 'STREET_NAME')
    let numero = await getBillingValue(pedido, 'STREET_NUMBER') 
    let bairro = await getBillingValue(pedido, 'NEIGHBORHOOD')
    let cep = await getBillingValue(pedido, 'ZIP_CODE')
    
    if(!razaoSocial || razaoSocial.toString().trim() == '')
        razaoSocial = razaoSocial2

    razaoSocial = razaoSocial.toString().toUpperCase().replace(`'`,`''`)
    fantasia = fantasia.toString().toUpperCase().replace(`'`,`''`)
    fantasia = fantasia.toString().toUpperCase().replace(`'`,`''`)
    endereco = endereco.toString().toUpperCase().replace(`'`,`''`)
    bairro = bairro.toString().toUpperCase().replace(`'`,`''`)    

    const dadosCidade = await getDadosCidade(cep).catch(err => console.log('Não conseguiu obter dados cidade:' + pedido.id + '-' + cep + err))

    let idCidade = 3510401
    let cidade = 'CAPIVARI'
    let estado = 'SP'

    if(!dadosCidade)
    {
        console.log('Sem dados cidade' + cep)    
    }
    else if(!dadosCidade.ibge)
    {
        console.log('Sem dados IBGE' + cep)        
    } 
    else
    {    
        cep = dadosCidade.cep
        idCidade = dadosCidade.ibge
        cidade = dadosCidade.localidade
        estado = dadosCidade.uf 
    }

    cidade = cidade.toString().toUpperCase().replace(`'`,`''`)

    //const telefone = pedido.buyer.phone.number
    const telefone = pedido.dataShip.receiver_address.receiver_phone

    const numeroDoPedidoDoCliente = pedido.payments.reduce((acc, v) => !acc ? '#' + v.id : acc + ' ' + '#' + v.id, '')

    const numeroCarrinho = pedido.pack_id

    const strSQL = `  
    
    set xact_abort ON

    if(exists(select * from PedidosDeVenda where numeroDoPedidoDoCliente like '%#${pedido.payments[0].id}%'))
        return

    if(not exists(select id from Entidades where dataFinal is null and cnpjCPF = '${cnpjCPF}'))
    begin
        exec sp_ML_InsertEntidades
            @cnpjCPF = '${cnpjCPF}',
            @ieRG = '${ieRG}',
            @razaoSocial = '${razaoSocial}',
            @fantasia = '${fantasia}',
            @endereco = '${endereco}',
            @numero = '${numero}',
            @bairro = '${bairro}',
            @idCidade = ${idCidade},
            @cidade = '${cidade}',
            @estado = '${estado}',
            @cep = '${cep}',
            @telefone = '${telefone}'
    end

    declare @idCliente numeric
    declare @codigoCliente numeric

    select top 1 @idCliente = id, @codigoCliente = codigo from Entidades where dataFinal is null and cnpjCPF = '${cnpjCPF}' order by id desc

    declare @idPedido numeric

    exec sp_ML_InsertPedido
            @idPedido = @idPedido out,
            @idCliente = @idCliente,
            @codigoCliente = @codigoCliente,
            @numeroDoPedidoDoCliente = '${numeroDoPedidoDoCliente}',
            @obsViaSeparacao = '${pedido.id + (pedido.pack_id ? ' - #' + pedido.pack_id : '')}',
            @totalProdutos =  ${totalProdutos},
            @totalNota = ${totalNota},
            @freteT = ${freteT},
            @outrasDespesasT = ${outrasDespesasT}
    `

    strSQLPedidos = ''

    await pedido.order_items.forEach(async (el,i) => {
        const freteI = freteT / totAux * (el.unit_price * el.quantity)
        strSQLPedidos += await getSTRSQLPedidoItens(el, i, freteI)    
    });

    const strSQLItenizar = `
    UPDATE dbo.PedidosDeVendaItens SET item = itemx FROM ( 
        SELECT id, ROW_NUMBER() OVER (ORDER BY id) itemx FROM dbo.PedidosDeVendaItens  WHERE idPedido = @idPedido
    ) a WHERE a.id = pedidosdevendaitens.id
    `

    console.log('Inserindo')
    await executeSQL(strSQL + strSQLPedidos + strSQLItenizar).catch(err => {
        const fs = require('fs');
        console.log('Erro SQL' + err + strSQL + strSQLPedidos)
        fs.appendFile('message.txt', strSQL + strSQLPedidos, function (err) {})
    })
}

async function getSTRSQLPedidoItens(item, i, freteI){

    let quantidade = item.quantity
    const valorUnitario = item.unit_price 
    const valorTotal = item.unit_price * item.quantity
    const outrasDespesasI = item.sale_fee

    let codigo = item.item.seller_sku
    if(!codigo)
        codigo = item.item.seller_custom_field

    let  strSQL = ''
    codigo.split('|').forEach(async aux => {

        aux = aux.split('(')

        let q = quantidade
        const codigoInternoManual = aux[0].trim()
        if(aux.length > 1)
        {
            const nx = aux[1].replace( /^\D+/g, '')
            q = q * parseInt(nx)
        }

        strSQL += `
        exec sp_ML_InsertPedidoItem 
            @idPedido = @idPedido,
            @item = ${i + 1},
            @quantidade = ${q},
            @valorTotal = ${valorTotal - freteI - outrasDespesasI},
            @freteI = ${freteI},
            @outrasDespesasI = ${outrasDespesasI},
            @codigoInternoManual = '${codigoInternoManual}'
        `
    })

    return strSQL + `
    update PedidosdeVendaItens set idOriginal = id where idOriginal is null

    exec sp_ML_Arredonda @idPedido = @idPedido, @item = ${i + 1} 

    `
}

module.exports = {
    gravaPedido: gravaPedido    
};