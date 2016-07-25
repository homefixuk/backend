var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var User = require('../models/user');

module.exports = function(passport) {
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
    opts.secretOrKey = "secret";
    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {         
        var userid = jwt_payload._doc._id
        //console.log('Deserialized User',userid)
        User.findOne({_id: userid}, function(err, user) {
            if (err) {
                //console.log("Passport Error", err);
                return done(err, false);
            }
            if (user) {
                //console.log("Passport User", user);
                done(null, user);
            } else {
                //console.log("Passport User Not Found");
                done(null, false);
            }
        });
    }));
};