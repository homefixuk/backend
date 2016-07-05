var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var Schema = mongoose.Schema;

var emailValidator = [
    validate({
        validator: 'isEmail',
        message: 'email not valid'
    })
];

var passwordValidator = [validate({
    validator: 'isLength',
    arguments: [6, 15],
    message: 'Password should be between {ARGS[0]} and {ARGS[1]} characters'
})]

var userSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, validate: emailValidator},
    password: {type: String, required: true, validate: passwordValidator},
    role: {type: String, enum:['TRADE','CUST'], default:'CUST'},
});

module.exports = mongoose.model('User', userSchema);