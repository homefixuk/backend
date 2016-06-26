var express = require('express');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}

module.exports = function (passport) {

    router.post('/signup', passport.authenticate('localapikey', {
        failureRedirect: '/client/unauthorized',
        failureFlash: true
    }), function (req, resp) {
        res.json({message: "Authenticated"})
    });

    router.post('/login', passport.authenticate('login', {
        successRedirect: '/home',
        failureRedirect: '/',
        failureFlash: true
    }));

    router.get('/home', isAuthenticated, function (req, res) {
        res.render('home', {user: req.user});
    });

    router.post('/signout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

   

    return router;
}
