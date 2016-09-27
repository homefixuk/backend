var mongoose = require('mongoose');
module.exports = mongoose.model('Property', {
    addressLine1: {type: String, default: ""},
    addressLine2: {type: String, default: ""},
    addressLine3: {type: String, default: ""},
    country: {type: String, default: ""},
    notes: {type: String, default: ""},
    numberBedrooms: {type: Number, default: 0},
    numberPropertyIssues: {type: Number, default: 0},
    numberTennants: {type: Number, default: 0},
    phone: {type: String, default: ""},
    postcode: {type: String, default: ""},
    properties: {type: String, default: ""}
});

