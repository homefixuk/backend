var mongoose = require('mongoose');
module.exports = mongoose.model('Timeslot', {
    tradesman: {type: mongoose.Schema.Types.ObjectId, ref: 'Tradesman', require: true},
    service: {type: mongoose.Schema.Types.ObjectId, ref: 'Service'},
    type: {type: String, enum: ['availability', 'break', 'service', 'own_job'], default: 'availability'},
    start: { type : Number, required:true, default:0 },
    end: { type : Number, required:true, default:0 },
    slotLength: {type: Number},
    canBeSplit:{ type : Boolean, default:false }
});