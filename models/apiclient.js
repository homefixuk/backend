var mongoose = require('mongoose');

module.exports = mongoose.model('ApiClient',{
    apiKey: String,
    description: String
});