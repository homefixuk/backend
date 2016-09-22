var mongoose = require('mongoose');
module.exports = mongoose.model('Service', {
    actualWorkCost: {type: Number, default:0},
    arrivalTime: {type: Number,default:0},
    departTime: {type: Number,default:0},
    estimatedWorkCost: {type: Number,default:0},
    estimatedWorkDuration: {type: Number,default:0},
    incompleteReason: {type: String,default:''},
    serviceType: {type: String,default:''},
    isOwnJob: {type: Boolean,default:false},
    keyLocation: {type: String,default:''},
    partsUsed: [{type: mongoose.Schema.Types.ObjectId, ref: 'Part'}],
    previousServices: [{type: mongoose.Schema.Types.ObjectId, ref: 'Service'}],
    problem: {type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true},
    requestTime: {type: Number,default:0},
    reservationId: {type: String,default:''},
    serviceSet: {type: mongoose.Schema.Types.ObjectId, ref: 'ServiceSet', required: true},
    status: {
        type: String,
        enum: ['dispatched', 'assigned', 'travelling', 'onsite', 'incomplete', 'complete', 'unknown'],
        default: 'unknown'
    },
    tradesman: {type: mongoose.Schema.Types.ObjectId, ref: 'Tradesman', required: true},
    tradesmanNotes: {type: String,default:''},
    workCompletedDescription: {type: String,default:''}
});