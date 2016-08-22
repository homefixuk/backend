var mongoose = require('mongoose');
module.exports = mongoose.model('Part', {
    cost: { type : Number},
    description: { type : String},
    from: {type: String},
    image: {type: String},
    includesVat: {type: Boolean},
    installationInfo: {type: String},
    model: {type: String},
    name: {type: String},
    service: {type: mongoose.Schema.Types.ObjectId, ref: 'Service', require: true},
    source: {type: String}
});