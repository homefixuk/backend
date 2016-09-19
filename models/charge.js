var mongoose = require('mongoose');
module.exports = mongoose.model('Charge', {
    service:{type: mongoose.Schema.Types.ObjectId, ref: 'Service', required:true},
    description	: {type:String,default:''},
    quantity:{type:Number,default:0, required:true},
    amount:{type:Number,default:0, required:true},
    withVat:{type:Boolean,default:false, required:true},
    markup:{type:Number,default:0, required:true},
    markupBeforeVat:{type:Boolean,default:false, required:true}
});