var mongoose = require('mongoose');
module.exports = mongoose.model('Service', {
    problem: {type: mongoose.Schema.Types.ObjectId, ref: 'Problem',required: true },
    status: { type: String, enum: ['dispatched', 'assigned', 'travelling', 'onsite', 'incomplete', 'complete','unknown'], default: 'unknown' },
    tradesman: {type: mongoose.Schema.Types.ObjectId, ref: 'Tradesman',required:true},
    requestTime: { type: Date },
    arrivalTime: { type: Date },
    departTime: { type: Date },
    estimatedWorkDuration: { type: String },
    estimatedWorkCost: { type: String },
    actualWorkDuration: { type: String },
    actualWorkCost: { type: String },
    quotedWorkCost: { type: String },
    tradesmanNotes: { type: String },
    keyLocation: { type: String }
});