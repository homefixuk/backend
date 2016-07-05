var express = require('express');
var router = express.Router();
var restify = require('express-restify-mongoose');
var Client = require('../models/apiclient');

var User = require('../models/user');
var Customer = require('../models/customer');
var Tradesman = require('../models/tradesman');
var Cca = require('../models/cca');

var TradesmanLocation = require('../models/tradesmanLocation');
var TradesmanNotification = require('../models/tradesmanNotifications');
var TradesmanReview = require('../models/tradesmanReview');

restify.serve(router,User);
restify.serve(router,Customer);
restify.serve(router,Tradesman);
restify.serve(router,Cca);
restify.serve(router,TradesmanLocation);
restify.serve(router,TradesmanNotification);
restify.serve(router,TradesmanReview);


for (i = 0; i < router.stack.length; i++) { 
    var route = router.stack[i].route;
    if(typeof route != 'undefined'){
        console.log(route.path)
        for(key in route.methods){
            console.log(key)
        }
    }    
}


module.exports = router;


