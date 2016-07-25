var express = require('express');
var router = express.Router();
var Tradesman = require('../models/tradesman');
var TradesmanPrivate = require('../models/tradesmanPrivate');

router.get('/tradesman/me', function (req, res, next) {
    Tradesman.findOne({user:req.user},function(err,tradesman){
        if(err){
            var err = new Error('Error encountered while requesting the Tradesman');
            err.status = 500;
            next(err);
        }else{
            if(tradesman){
                res.send(tradesman);
            }else{
                var err = new Error('Requested Treadesman could not be found');
                err.status = 500;
                next(err);                
            }
        }
    });
});

router.get('/tradesman/me/private', function (req, res, next) {
    Tradesman.findOne({user:req.user},function(err,tradesman){
        if(err){
            var err = new Error('Error encountered while requesting the Tradesman');
            err.status = 500;
            next(err);
        }else{
            if(tradesman){
                TradesmanPrivate.findOne({tradesman:tradesman},function(err,tradesmanPrivate){
                   if(err){
                       var err = new Error('Private Details could not be found for this Treadesman');
                       err.status = 500;
                       next(err);                       
                   }else{
                        res.send(tradesmanPrivate);       
                   }
                });                
            }else{
                var err = new Error('Requested Treadesman could not be found');
                err.status = 500;
                next(err);                
            }
        }
    });
});

module.exports = router;
