var express = require('express');
var router = express.Router();
var User = require('../../models/user')
var Tradesman = require('../../models/tradesman')
var isAuthenticated = function(req, res, next) {
    if(req.isAuthenticated()) return next();
    res.redirect('/');
}
module.exports = function(passport) {
    router.post('/signup', passport.authenticate('localapikey', {
        failureRedirect: '/clients/unauthorized',
        failureFlash: true
    }), function(req, res) {
        User.findOne({
            'email': req.body.email
        }, function(err, user) {
            if(err) {
                res.status(500).json({
                    message: "Error creating new Tradesman",
                    error: err
                })
            } else if(user) {
                console.log(': ' + username);
                res.status(500).json({
                    message: "User already exists with email",
                })
            } else {
                var newUser = new User();
                newUser.firstName = req.body.firstName;
                newUser.email = req.body.email;
                newUser.password = req.body.password;
                newUser.save(function(err, user) {
                    if(err) {
                        res.status(500).json({
                            message: "Error creating new Tradesman",
                            error: err
                        })
                    } else {
                        var tradesman = new Tradesman();
                        console.log(user);
                        tradesman.user = user;
                        tradesman.save(function(err, tradesman) {
                            if(err) {
                                res.status(500).json({
                                    message: "Error creating new Tradesman",
                                    error: err
                                })
                            } else {
                                console.log(tradesman);
                                res.json({
                                    message: "New Tradesman created"
                                })
                            }
                        })
                    }
                })
            }
        });
    });
    router.post('/login', passport.authenticate('login', {
        successRedirect: '/home',
        failureRedirect: '/',
        failureFlash: true
    }));
    router.get('/home', isAuthenticated, function(req, res) {
        res.render('home', {
            user: req.user
        });
    });
    router.post('/signout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    return router;
}