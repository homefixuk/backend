var mongoose = require('mongoose');

module.exports = mongoose.model('TradesmanPrivate',{
    accountNumber:{type:String, default:''},
    accountName:{type:String, default:''},
    sortCode:{type:String, default:''},
    vatNumber:{type:String, default:''},
    tradesman: {type:mongoose.Schema.Types.ObjectId, ref:'Tradesman', required:true}
});