var mongoose = require('mongoose');
module.exports = mongoose.model('Address', {
    address: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
});