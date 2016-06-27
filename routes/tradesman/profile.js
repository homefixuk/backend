var express = require('express');
var router = express.Router();
var User = require('../../models/user');
var Tradesman = require('../../models/tradesman');


module.exports = function (passport) {

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