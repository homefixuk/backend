var express = require('express');
var router = express.Router();
var Client = require('../models/client')

var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}

module.exports = function (passport) {

    /* GET login page. */
    router.get('/', function (req, res) {
        res.render('index', {message: req.flash('message')});
    });

    /* Handle Login POST */
    router.post('/login', passport.authenticate('login', {
        successRedirect: '/home',
        failureRedirect: '/',
        failureFlash: true
    }));

    /* GET Home Page */
    router.get('/home', isAuthenticated, function (req, res) {
        res.render('home', {user: req.user});
    });

    router.get('/client/unauthorized', function (req, res) {
        res.json({message: "Unauthorized Client"})
    });

    router.post('/clients', function (req, res) {
        console.log(req.body.key);

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


    router.get('/signout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    return router;
}
