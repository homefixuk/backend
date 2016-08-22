var mongoose = require('mongoose');
module.exports = mongoose.model('Timeslot', {
    tradesman: {type: mongoose.Schema.Types.ObjectId, ref: 'Tradesman', require: true},
    service: {type: mongoose.Schema.Types.ObjectId, ref: 'Service', require: true},
    type: {type: String, enum: ['availability', 'break', 'service', 'own_job'], default: 'availability'},
    start: { type : Number, default: Date.now },
    end: { type : Number, default: Date.now },
    slotLength: {type: Number}
});