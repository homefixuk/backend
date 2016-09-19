var mongoose = require('mongoose');

module.exports = mongoose.model('Customer',{
    user: {type:mongoose.Schema.Types.ObjectId, ref:'User',required:true},
    priority: {type:String, default:""},
    totalSpent: {type:Number, default:0}
});