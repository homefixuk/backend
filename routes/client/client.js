var express = require('express');
var router = express.Router();
var Client = require('../../models/client');
var hat = require('hat');


module.exports = function () {

    router.get('/unauthorized', function (req, res) {
        res.json({message: "Unauthorized Client"})
    });

    router.post('/', function (req, res) {
        var client = new Client();
        client.apiKey = hat();
        client.description = req.body.description;
        client.save(function (err, clnt) {
            if (err) {
                res.json({message: "Could not create new client", error: err});
            }
            res.json({message: "New API Client created", key: clnt.apiKey, client: clnt.description});
        })
    });

    return router;
}
