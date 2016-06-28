var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Tradesman = require('../models/tradesman');


module.exports = function (passport) {

    router.post('/signup', passport.authenticate('localapikey', {
        failureRedirect: 'clients/unauthorized'
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
                res.status(500).json({
                    message: "User already exists with email",
                })
            } else {
                var newUser = new User();
                newUser.firstName = req.body.firstName;
                newUser.lastName = req.body.lastName;
                newUser.email = req.body.email;
                newUser.password = req.body.password;
                if(req.body.role){
                    newUser.role = req.body.role
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
                                    res.status(500).json({
                                        message: "Error creating new Tradesman",
                                        error: err
                                    })
                                } else {
                                    //console.log(tradesman);
                                    res.json({
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