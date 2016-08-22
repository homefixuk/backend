var mongoose = require('mongoose');
module.exports = mongoose.model('TradesmanLocation', {
    activity: {type: String, enum: ['unknown', 'still', 'walking', 'in-vehicle', 'running'], default: 'unknown'},
    isGoingtToJob: {type: Boolean, default: false},
    timestamp: {type: Date, default: Date.now},
    tradesman: {type: mongoose.Schema.Types.ObjectId, ref: 'Tradesman', require: true},
    geoPoint: {latitude: {type: String, required: true}, longitude: {type: String, required: true}}
});