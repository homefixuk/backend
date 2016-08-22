var mongoose = require('mongoose');
module.exports = mongoose.model('Problem', {
    description: { type: String },
    name: { type: String },
    potentialParts: { type: Array, default:[] }
});