var express = require('express');
var router = express.Router();
var User = require('../../models/user');
var Tradesman = require('../../models/tradesman');

module.exports = function (passport) {

    router.post('/signup', passport.authenticate('localapikey', {
        failureRedirect: '/clients/unauthorized'
    }), function (req, res) {
        User.findOne({
            'email': req.body.email
        }, function (err, user) {
            if (err) {
                res.status(500).json({
                    message: "Error creating new Tradesman",
                    error: err
                })
            } else if (user) {
                console.log(': ' + username);
                res.status(500).json({
                    message: "User already exists with email",
                })
            } else {
                var newUser = new User();
                newUser.firstName = req.body.firstName;
                newUser.lastName = req.body.lastName;
                newUser.email = req.body.email;
                newUser.password = req.body.password;
                newUser.save(function (err, user) {
                    if (err) {
                        res.status(500).json({
                            message: "Error creating new Tradesman",
                            error: err
                        })
                    } else {
                        var tradesman = new Tradesman();
                        console.log(user);
                        tradesman.user = user;
                        tradesman.save(function (err, tradesman) {
                            if (err) {
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


    router.get('/me', passport.authenticate('jwt', {session: false}), function (req, res) {
        User.findOne({email: req.user.email}, function (err, user) {
            if (err) {
                res.status(500).json({message: "Error", error: err});
            } else {
                Tradesman.findOne({user: user}, function (err, tradesman) {
                    if (err) {
                        res.status(500).json({message: "Error", error: err});
                    }
                    else {
                        res.json({user: user, tradesman: tradesman});
                    }
                })

            }
        })

    });

    router.post('/me', passport.authenticate('jwt', {session: false}), function (req, res) {
    });
    
    return router;
}