var mongoose = require('mongoose');

module.exports = mongoose.model('Client',{
    apiKey: String,
    description: String
});