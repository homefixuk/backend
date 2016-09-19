var mongoose = require('mongoose');
module.exports = mongoose.model('CustomerProperty', {
    customer: {type: mongoose.Schema.Types.ObjectId, ref: 'Customer'},
    from: {type: Number, default: 0},
    property: {type: mongoose.Schema.Types.ObjectId, ref: 'Property'},
    type: {type: String,  enum: ['owner', 'tenant','management'], default: 'owner'},
    until: {type: Number, default: 0}
});