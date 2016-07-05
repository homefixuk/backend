var mongoose = require('mongoose');
module.exports = mongoose.model('TradesmanLocation', {
    tradesman: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tradesman',
        require: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    isGoingtoJob: {
        type: Boolean,
        default: false
    },
    geoPoint: {
        lat: {
            type: String,
            required: true
        },
        long: {
            type: String,
            required: true
        }
    },
    activity: {
        type: String,
        enum: ['UNKWN', 'ONFOOT', 'INVEHICLE'],
        default: 'UNKWN'
    }
});