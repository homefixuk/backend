var LocalApiStrategy = require('passport-localapikey').Strategy;
var Client = require('../models/client');


module.exports = function(passport){
    passport.use(new LocalApiStrategy(
        function(apikey, done) {

            process.nextTick(function () {
                Client.findOne({ 'apiKey' :  apikey },
                    function(err, client) {

                        if (err)
                            return done(err);

                        if (!client){
                            console.log('client Not Found with username '+username);
                            return done(null, false, req.flash('message', 'User Not found.'));
                        }

                        return done(null, client);
                    }
                );
            });
        }
    ));

}