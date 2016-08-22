var express = require('express');
var router = express.Router();
var Tradesman = require('../models/tradesman');
var Timeslot = require('../models/timeslot');
var Service = require('../models/service');

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
                var err = new Error('Requested Tradesman could not be found');
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
            err.err = err;
            err.status = 500;
            next(err);
        } else {
            if(tradesman) {
                if(req.query.service){
                    Service.findOne({_id:req.query.service}).exec(function(err,service){
                        if(err){
                            var nErr = new Error('Error encountered while getting Service for Timeslot');
                            nErr.err = err;
                            nErr.status = 500;
                            next(nErr);
                        }else{
                            var tslot = new Timeslot();
                            tslot.tradesman = tradesman;
                            tslot.service = service;
                            if(req.query.end){
                                tslot.end = req.query.end;
                            }
                            if(req.query.start){
                                tslot.start = req.query.start;
                            }
                            if(req.query.slotLength){
                                tslot.slotLength = req.query.slotLength;
                            }
                            tslot.save(function(err,tslot){
                                if(err){
                                    var nErr = new Error('Error saving Timeslot');
                                    nErr.err = err;
                                    nErr.status = 500;
                                    next(nErr);
                                }else{
                                    res.json({success: true, message: 'New Timeslot Created', timeslot: tslot._id});
                                }
                            });
                        }
                    });

                }else{
                    var nErr = new Error('Existing Service required for creating Timeslot');
                    nErr.err = err;
                    nErr.status = 500;
                    next(nErr);
                }

            } else {
                var err = new Error('Requested Tradesman could not be found');
                err.status = 500;
                next(err);
            }
        }
    });
});

router.patch('/tradesman/timeslots/:id', function(req, res, next) {
    Timeslots.findOneAndUpdate({_id:req.params.id},req.query, function(err,tslot){
        if(err){
            var newErr = new Error('Error encountered while updating the Timeslot');
            newErr.error = err;
            newErr.status = 500;
            next(newErr);
        }else{
            res.json({success: true, message: 'Timeslot Updated', timeslot: tslot._id});
        }
    });
});

router.delete('/tradesman/timeslots/:id', function(req, res, next) {
    Timeslots.find({_id:req.params.id}).remove().exec(function(err){
        if(err){
            var newErr = new Error('Error deleting Timeslot');
            newErr.error = err;
            newErr.status = 500;
            next(newErr);
        }else{
            res.json({success: true, message: 'Timeslot Deleted'});
        }
    });
});


module.exports = router;