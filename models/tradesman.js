var mongoose = require('mongoose');

module.exports = mongoose.model('Tradesman',{
    user: {type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    type:{type:String, default:''},
    rating:{type:String, default:''},
    numberOfReviews:{type:String, default:''},
    experience:{type:String, default:''},
    tradesmanLocation:{type:mongoose.Schema.Types.ObjectId, ref:'TradesmanLocation'},
    workAreas:{ type : Array , "default" : [] },
    standardWeeklyHours:{type:String, default:''},
    settings:{ type : Array , "default" : [] }
});