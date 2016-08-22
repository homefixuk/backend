var mongoose = require('mongoose');
module.exports = mongoose.model('Timeslot', {
    tradesman: {type: mongoose.Schema.Types.ObjectId, ref: 'Tradesman', require: true},
    service: {type: mongoose.Schema.Types.ObjectId, ref: 'Service', require: true},
    type: {type: String, enum: ['availability', 'break', 'service', 'own_job'], default: 'availability'},
    start: { type : Number, required:true },
    end: { type : Number, required:true },
    slotLength: {type: Number, required:true}
});