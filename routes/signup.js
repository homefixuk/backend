var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Tradesman = require('../models/tradesman');


module.exports = function (passport) {

    router.post('/user/signup', passport.authenticate('localapikey', {
        failureRedirect: '/unauthorized'
    }), function (req, res) {
        User.findOne({
            'email': req.query.email
        }, function (err, user) {
            if (err) {
                res.status(500).json({
                    message: "Error creating new Tradesman",
                    error: err
                })
            } else if (user) {
                res.status(500).json({
                    message: "User already exists with email",
                })
            } else {
                console.log('Creating New User',req.params);
                var newUser = new User();
                newUser.firstName = req.query.firstName;
                newUser.lastName = req.query.lastName;
                newUser.email = req.query.email;
                newUser.password = req.query.password;
                if(req.query.role){
                    newUser.role = req.query.role
                }
                newUser.save(function (err, user) {
                    if (err) {
                        res.status(500).json({
                            message: "Error creating new User",
                            error: err
                        })
                    } else {
                        if(user.role == 'TRADE') {
                            var tradesman = new Tradesman();
                            console.log(user);
                            tradesman.user = user;
                            tradesman.save(function (err, tradesman) {
                                if (err) {
                                     if (err.name == 'ValidationError') {
                                         console.log('Setting ValidationError')
                                        res.status(401).json({
                                            message: "ValidationError creating new Tradesman",
                                            error: err
                                        });
                                         
                                     }else{
                                        res.status(500).json({
                                            message: "Error creating new Tradesman",
                                            error: err
                                        });
                                     }
                                } else {
                                    //console.log(tradesman);
                                    res.status(201).json({
                                        message: "New Tradesman created"
                                    })
                                }
                            })
                        }else{
                            res.json({
                                message: "New Customer Created"
                            });
                        }
                    }
                })
            }
        });
    });


    return router;
}