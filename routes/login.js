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
        //console.log('JWT User',req.user);
        var token = jwt.sign(req.user, "secret", {
            expiresIn: 86400
        });
        res.json({ success: true, token: 'JWT ' + token });
    });



    return router;
}