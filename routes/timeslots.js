var express = require('express');
var router = express.Router();
var Tradesman = require('../models/tradesman');
var Timeslot = require('../models/timeslot');

router.get('/tradesman/timeslots', function(req, res, next) {
    Tradesman.findOne({
        user: req.user
    }).exec(function(err, tradesman) {
        if(err) {
            var err = new Error('Error encountered while requesting the Tradesman');
            err.status = 500;
            next(err);
        } else {
            if(tradesman) {

                Timeslot.find({
                    tradesman: tradesman
                }).populate('tradesman').exec(function(err, timeslots) {
                    if(err) {
                        var err = new Error('Timeslots could not be found for this Tradesman');
                        err.status = 500;
                        next(err);
                    } else {
                        res.json(timeslots);
                    }
                });

            } else {
                var err = new Error('Requested Treadesman could not be found');
                err.status = 500;
                next(err);
            }
        }
    });
});

router.post('/tradesman/timeslots', function(req, res, next) {
    Tradesman.findOne({
        user: req.user
    }).exec(function(err, tradesman) {
        if(err) {
            var err = new Error('Error encountered while requesting the Tradesman');
            err.status = 500;
            next(err);
        } else {
            if(tradesman) {

                
                
                
                
                Timeslot.find({
                    tradesman: tradesman
                }).populate('tradesman').exec(function(err, timeslots) {
                    if(err) {
                        var err = new Error('Timeslots could not be found for this Tradesman');
                        err.status = 500;
                        next(err);
                    } else {
                        res.json(timeslots);
                    }
                });

            } else {
                var err = new Error('Requested Treadesman could not be found');
                err.status = 500;
                next(err);
            }
        }
    });
});

module.exports = router;