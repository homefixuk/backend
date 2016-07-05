var mongoose = require('mongoose');

module.exports = mongoose.model('Customer',{
    user: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
    mobile: String,
    homeAddress: {type: mongoose.Schema.Types.ObjectId, ref: 'Address'},
    billingAddress: {type: mongoose.Schema.Types.ObjectId, ref: 'Address'},
    priority: String,
    totalSpent: Number
});