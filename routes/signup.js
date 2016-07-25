var express = require('express');
var router = express.Router();
var User = require('../models/user');

var Tradesman = require('../models/tradesman');
var TradesmanPrivate = require('../models/tradesmanPrivate');

module.exports = function (passport) {

    router.post('/user/signup', passport.authenticate('localapikey', {
        failureRedirect: '/unauthorized'
    }), function (req, res) {
        
        console.log('Express Query Object',req.query);
        
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
                //console.log('Creating New User',req.params);
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
                            //console.log(user);
                            var tradesman = new Tradesman();                            
                            tradesman.user = user;
                            tradesman.save(function (err, tradesman) {
                                if (err) {
                                     if (err.name == 'ValidationError') {
                                        //console.log('Setting ValidationError')
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
                                    var tP = new TradesmanPrivate({tradesman: tradesman});
                                    tP.save();
                                    res.send(tradesman);
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