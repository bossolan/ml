function getTokenCode(req, res){    
    console.log(req.query.code);
    console.log(req.body);
    console.log(req.data);
}


module.exports = {
    getToken: getTokenCode
};



 