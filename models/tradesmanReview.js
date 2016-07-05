var mongoose = require('mongoose');
module.exports = mongoose.model('TradesmanReview', {
    tradesman: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tradesman',
        require: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        require: true
    },
    ratings: {
        type: String,
        required:true
    },
    review: {
        type: String
    }   
});