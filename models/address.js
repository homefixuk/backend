var mongoose = require('mongoose');
var schema = require('./schema/address.json')

module.exports = mongoose.model('Address', {
    address: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
});