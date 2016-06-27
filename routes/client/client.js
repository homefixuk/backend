var express = require('express');
var router = express.Router();
var Client = require('../../models/client')

module.exports = function () {

    router.get('/unauthorized', function (req, res) {
        res.json({message: "Unauthorized Client"})
    });

    router.post('/', function (req, res) {
        var client = new Client();
        client.apiKey = req.body.key;
        client.description = req.body.description;
        client.save(function (err) {
            console.log(err);
            if (err) {
                res.json({message: "Could not create new client", error: err});
            }
            res.json({message: "New API Key created"});
        })
    });

    return router;
}
