var mongoose = require('mongoose');
module.exports = mongoose.model('CustomerProperty', {
    customer: {type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required:true},
    from: {type: Number, default: 0},
    property: {type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true},
    type: {type: String,  enum: ['owner', 'tenant','management'], default: 'owner'},
    until: {type: Number, default: 0}
});