var mongoose = require('mongoose');

module.exports = mongoose.model('Tradesman',{
    user: {type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    type:{type:String, default:''},
    rating:{type:Number, default:''},
    numberOfReviews:{type:Number, default:''},
    experience:{type:Number, default:''},
    tradesmanLocation:{type:mongoose.Schema.Types.ObjectId, ref:'TradesmanLocation'},
    workAreas:{ type : Array , "default" : [] },
    standardWeeklyHours:{type:String},
    settings:{ type : String}
});