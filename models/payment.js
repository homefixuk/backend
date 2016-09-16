var mongoose = require('mongoose');
module.exports = mongoose.model('Payment', {
    serviceSet: {type: mongoose.Schema.Types.ObjectId, ref: 'ServiceSet'},
    amount: {type: Number, default: 0},
    type: {type: String, enum: ['cash', 'cheque', 'bank_transfer', 'card']}
});