    var express = require('express');
var router = express.Router();
var Client = require('../models/apiclient');

router.post('/clients',function(req,res){
    console.log(req.params, req.body, req.query);
    var newClient = new Client({description:req.query.description});
    newClient.save(function(err,client){
        if(err) res.status(500).send(error);
        else res.send(client);
    });
});

module.exports = router;