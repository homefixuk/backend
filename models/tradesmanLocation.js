var mongoose = require('mongoose');
module.exports = mongoose.model('TradesmanLocation', {
    activity: {type: String, enum: ['unknown', 'still', 'walking', 'in_vehicle', 'running'], default: 'unknown'},
    isGoingToJob: {type: Boolean, default: false},
    timestamp: {type: Number, default: Date.now},
    tradesman: {type: mongoose.Schema.Types.ObjectId, ref: 'Tradesman', require: true},
    location: {latitude: {type: Number, required: true}, longitude: {type: Number, required: true}}
});