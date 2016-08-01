var mongoose = require('mongoose');
module.exports = mongoose.model('Service', {
    tradesman: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tradesman'
    },
    problem: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['UNKWN', 'NEW', 'IN_PROGRESS', 'COMPLETE'],
        default: 'UNKWN'
    },
    requestTime: {
        type: Date
    },
    arrivalTime: {
        type: Date
    },
    departTime: {
        type: Date
    },
    estimatedWorkDuration: {
        type: String
    },
    estimatedWorkCost: {
        type: String
    },
    actualWorkDuration: {
        type: String
    },
    actualWorkCost: {
        type: String
    },
    quotedWorkCost: {
        type: String
    },
    tradesmanNotes: {
        type: String
    },
    keyLocation: {
        type: String
    }
});