var mongoose = require('mongoose');
module.exports = mongoose.model('ServiceSet', {
    amountPaid: {type: Number, default: 0},
    charges: [{type: mongoose.Schema.Types.ObjectId, ref: 'Charge'}],
    createdAt: {type: Number, default: 0},
    customerDescription: {type: String, default: ''},
    customerProperty: {type: mongoose.Schema.Types.ObjectId, ref: 'CustomerProperty'},
    labourCost: {type: Number, default: 0},
    numberServices: {type: Number, default: 0},
    payments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Payment'}],
    resolvedAt: {type: Number, default: 0},
    totalCost: {type: Number, default: 0},
    totalWorkTimeInMinutes: {type: Number, default: 0}
});