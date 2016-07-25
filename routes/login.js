var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

module.exports = function (passport) {

    router.get('/user/login',function(req,res){
        res.status(403).json({message:"Please Login"});
    })

    router.post('/user/login', passport.authenticate('local', {
        failureRedirect: 'login'
    }), function(req, res) {
        var token = jwt.sign(req.user, "secret", {
            expiresIn: 10080
        });
        res.json({ success: true, token: 'JWT ' + token });
    });



    return router;
}