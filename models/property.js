var mongoose = require('mongoose');
module.exports = mongoose.model('Property', {
    addressLine1: {type: String, default: ""},
    addressLine2: {type: String, default: ""},
    addressLine3: {type: String, default: ""},
    country: {type: String, default: ""},
    notes: {type: String, default: ""},
    numberBedrooms: {type: Number, default: ""},
    numberPropertyIssues: {type: Number, default: ""},
    numberTennants: {type: Number, default: ""},
    phone: {type: String, default: ""},
    postcode: {type: String, default: ""},
    properties: {type: String, default: ""}
});

