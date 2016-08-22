var mongoose = require('mongoose');
module.exports = mongoose.model('TradesmanNotification', {
    tradesman: {type: mongoose.Schema.Types.ObjectId, ref: 'Tradesman', require: true},
    service: {type: mongoose.Schema.Types.ObjectId, ref: 'Service', require: true},
    type: {type: String},
    title: {type: String, required:true},
    content: {type: String}
});