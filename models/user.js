var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var Schema = mongoose.Schema;

var emailValidator = [
  validate({
    validator: 'isEmail',
    message: 'email not valid'
  })
];

var passwordValidator = [ validate({
    validator: 'isLength',
    arguments: [8, 15],
    message: 'Password should be between {ARGS[0]} and {ARGS[1]} characters'
  }),]

var userSchema = new Schema({
    firstName: {type: String, required:true},
    lastName: String,
    email: {type: String, required:true, validate: emailValidator},
    password: {type: String, required:true, validate: passwordValidator},
    mobile: String,
    homeAddress: {type:mongoose.Schema.Types.ObjectId,ref:'Address'},
    billingAddress: {type:mongoose.Schema.Types.ObjectId,ref:'Address'},
    role:String,
    priority: String,
    totalSpent:Number
});

module.exports = mongoose.model('User',userSchema);