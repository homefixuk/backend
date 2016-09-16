var mongoose = require('mongoose');
module.exports = mongoose.model('User', {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, validate: emailValidator },
    password: { type: String, required: true, validate: passwordValidator },
    role: { type: String, enum: ['TRADE', 'CUST'], default: 'CUST' },
    billingAddressLine1: { type: String, default: '' },
    billingAddressLine2: { type: String, default: '' },
    billingAddressLine3: { type: String, default: '' },
    billingCountry: { type: String, default: '' },
    billingPostcode: { type: String, default: '' },
    homeAddressLine1: { type: String, default: '' },
    homeAddressLine2: { type: String, default: '' },
    homeAddressLine3: { type: String, default: '' },
    homeCountry: { type: String, default: '' },
    homePostcode: { type: String, default: '' },
    homePhone: { type: String, default: '' },
    mobile: { type: String, default: '' },
    token: { type: String, default: '' }
});


