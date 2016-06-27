var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var User = require('../models/user');

module.exports = function(passport) {
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
    opts.secretOrKey = "secret";
    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        
        User.findOne({id: jwt_payload.id}, function(err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                console.log("Passport User", user);
                done(null, user);
            } else {
                done(null, false);
            }
        });
    }));
};