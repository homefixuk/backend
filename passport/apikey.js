var LocalApiStrategy = require('passport-localapikey').Strategy;
var Client = require('../models/apiclient');

module.exports = function (passport) {
    passport.use(new LocalApiStrategy(
        function (apikey, done) {
            console.log('Passport Api Key Function')
            Client.findOne({'apiKey': apikey},
                function (err, client) {
                    if (err)
                        return done(err);
                    if (!client) {
                        console.log('Invalid API Key');
                        return done(null, false);
                    }
                    return done(null, client);
                }
            );
        }
    ));

}