var mongoose = require('mongoose');
module.exports = mongoose.model('Timeslot', {
    tradesman: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tradesman',
        require: true
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        require: true
    },
     type: {
        type: String,
        enum: ['AVAILABILITY', 'BREAK', 'SERVICE'],
        default: 'AVAILABILITY'
    },
    start: { type : Date, default: Date.now },
    end: { type : Date, default: Date.now },
     length: {
        type: Number
    }   
});