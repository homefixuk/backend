var mongoose = require('mongoose');
var hat = require('hat');
var Schema = mongoose.Schema;

var schema = new Schema({
    apiKey: String,
    description: String
});

schema.pre('save', function(next) {
    console.log('pre save function');
    this.apiKey = hat();
    next();
});

module.exports = mongoose.model('ApiClient',schema );