var express = require('express');
var router = express.Router();
var restify = require('express-restify-mongoose');

var User = require('../models/user');
var Customer = require('../models/customer');
var Tradesman = require('../models/tradesman');
var Cca = require('../models/cca');

var TradesmanLocation = require('../models/tradesmanLocation');
var TradesmanNotification = require('../models/tradesmanNotification');
var TradesmanReview = require('../models/tradesmanReview');
var Timeslot = require('../models/timeslot');

console.log('User Schema', User.schema.tree);

restify.serve(router,User);
restify.serve(router,Customer);
restify.serve(router,Tradesman);
restify.serve(router,Cca);
restify.serve(router,TradesmanLocation);
restify.serve(router,TradesmanNotification);
restify.serve(router,TradesmanReview);
restify.serve(router,Timeslot);


for (i = 0; i < router.stack.length; i++) { 
    var route = router.stack[i].route;
    if(typeof route != 'undefined'){
        //console.log(route)
        console.log(route.path)
        for(key in route.methods){
            console.log(key)
        }
    }    
}


module.exports = router;


