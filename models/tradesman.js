var mongoose = require('mongoose');

module.exports = mongoose.model('Tradesman',{
    user: {type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    currentLocation:{type:mongoose.Schema.Types.ObjectId, ref:'TradesmanLocation'},
    experience:{type:Number, default:0},
    numberOfReviews:{type:Number, default:0},
    picture :{type:String, default:''},
    rating:{type:Number, default:0},
    settings:{type : Object, default:{}},
    standardWeeklyHours:{type : Object, default:{}},
    type:{type:String, default:''},
    workAreas:{ type : Array , "default" : [] }
});



