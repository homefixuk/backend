var mongoose = require('mongoose');
module.exports = mongoose.model('Part', {
    cost: { type : Number, default:0},
    description: { type : String, default:''},
    from: {type: String, default:''},
    image: {type: String, default:''},
    includesVat: {type: Boolean, default:false},
    installationInfo: {type: String, default:''},
    model: {type: String, default:''},
    name: {type: String, default:''},
    service: {type: mongoose.Schema.Types.ObjectId, ref: 'Service', require: true},
    source: {type: String, default:''}
});