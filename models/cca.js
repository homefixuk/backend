var mongoose = require('mongoose');

module.exports = mongoose.model('Cca',{
    user: {type:mongoose.Schema.Types.ObjectId, ref:"User"},
    type:String,
    workAreas:{ type : Array , default : [] },
    standardWeeklyHours:String,
    settings:{ type : Array , default : [] }
});