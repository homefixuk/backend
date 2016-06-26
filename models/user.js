var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    mobile: String,
    homeAddress: {type:mongoose.Schema.Types.ObjectId,ref:'Address'},
    billingAddress: {type:mongoose.Schema.Types.ObjectId,ref:'Address'},
    role:String,
    priority: String,
    totalSpent:Number
});