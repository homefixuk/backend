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
                            console.log('Invalid API Key');
                            return done(null, false);
                        }
                        return done(null, client);
                    }
                );
            });
        }
    ));

}