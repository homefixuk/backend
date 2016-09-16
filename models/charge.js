var mongoose = require('mongoose');
module.exports = mongoose.model('Charge', {
    service:{type: mongoose.Schema.Types.ObjectId, ref: 'Service'},
    description	: {type:String,default:''},
    quantity:{type:Number,default:0},
    amount:{type:Number,default:0},
    withVat:{type:Boolean,default:false},
    markup:{type:Number,default:0},
    markupBeforeVat:{type:Boolean,default:false}
});