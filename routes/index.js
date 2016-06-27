var express = require('express');
var router = express.Router();

module.exports = function (passport) {

    router.get('/signout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    return router;
}
