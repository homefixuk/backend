var express = require('express');
var router = express.Router();
var Tradesman = require('../models/tradesman');
var TradesmanPrivate = require('../models/tradesmanPrivate');
var TradesmanLocation = require('../models/tradesmanLocation');
router.get('/tradesman/me', function(req, res, next) {
    Tradesman.findOne({
        user: req.user
    }, function(err, tradesman) {
        if(err) {
            var err = new Error('Error encountered while requesting the Tradesman');
            err.status = 500;
            next(err);
        } else {
            if(tradesman) {
                res.send(tradesman);
            } else {
                var err = new Error('Requested Treadesman could not be found');
                err.status = 500;
                next(err);
            }
        }
    });
});
router.get('/tradesman/me/private', function(req, res, next) {
    Tradesman.findOne({
        user: req.user
    }).exec(function(err, tradesman) {
        if(err) {
            var err = new Error('Error encountered while requesting the Tradesman');
            err.status = 500;
            next(err);
        } else {
            if(tradesman) {
                TradesmanPrivate.findOne({
                    tradesman: tradesman
                }).populate('tradesman').exec(function(err, tradesmanPrivate) {
                    if(err) {
                        var err = new Error('Private Details could not be found for this Treadesman');
                        err.status = 500;
                        next(err);
                    } else {
                        res.json({message:'Tradesman Details Updated'});
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
router.patch('/tradesman/me', function(req, res, next) {
    Tradesman.findOneAndUpdate({
        user: req.user
    }, req.query, function(err, tradesman) {
        if(err) {
            var newErr = new Error('Error encountered while updating the Tradesman');
            newErr.error = err;
            newErr.status = 500;
            next(newErr);
        } else {
            res.send(tradesman)
        }
    });
});
router.patch('/tradesman/me/private', function(req, res, next) {
    Tradesman.findOne({
        user: req.user
    }).exec(function(err, tradesman) {
        if(err) {
            var err = new Error('Error encountered while requesting the Tradesman');
            err.status = 500;
            next(err);
        } else {
            if(tradesman) {
                TradesmanPrivate.findOneAndUpdate({
                    tradesman: tradesman
                }, req.query, function(err, tradesmanPrivate) {
                    if(err) {
                        var newErr = new Error('Private Details could not be updated for this Tradesman');
                        newErr.error = err
                        newErr.status = 500;
                        next(newErr);
                    } else {
                        res.json({message:'Tradesman Private Details Updated'})
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
router.patch('/tradesman/location', function(req, res, next) {
    Tradesman.findOne({
        user: req.user
    }).exec(function(err, tradesman) {
        if(err) {
            var err = new Error('Error encountered while requesting the Tradesman');
            err.status = 500;
            next(err);
        } else {
            if(tradesman) {
                
                var geoPoint = {};
                geoPoint.lat = req.query.latitude;
                geoPoint.lng = req.query.longitude;
                var location = new TradesmanLocation({
                    tradesman: tradesman,
                    geoPoint: geoPoint,
                    activity: req.query.activity
                });
                                
                location.save(function(err, location) {
                    if(err) {
                        var newErr = new Error('Error updating Tradesman Location');
                        newErr.error = err;
                        newErr.status = 500;
                        next(newErr);
                    } else {
                        console.log('Setting saved location');
                        tradesman.tradesmanLocation = location._id;
                        tradesman.save(function(err,resp){
                            if(err){
                                var newErr = new Error('Error updating current location for this Tradesman');
                                newErr.error = err;
                                newErr.status = 500;
                                next(newErr);
                            }else{
                                res.json({message:'Tradesman Current Location Updated'})
                            }
                        });

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
module.exports = router;