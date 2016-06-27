var mongoose = require('mongoose');

module.exports = mongoose.model('Tradesman',{
    user: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
    type:String,
    rating:String,
    numberOfReviews:String,
    experience:String,
    tradesManLocation:{lat:Number,lng:Number},
    workAreas:{ type : Array , "default" : [] },
    standardWeeklyHours:String,
    settings:{ type : Array , "default" : [] }
});