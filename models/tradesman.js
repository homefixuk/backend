var mongoose = require('mongoose');

module.exports = mongoose.model('Tradesman',{
    user: {type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    type:String,
    rating:String,
    numberOfReviews:String,
    experience:String,
    tradesmanLocation:{type:mongoose.Schema.Types.ObjectId, ref:'TradesmanLocation'},
    workAreas:{ type : Array , "default" : [] },
    standardWeeklyHours:String,
    settings:{ type : Array , "default" : [] }
});