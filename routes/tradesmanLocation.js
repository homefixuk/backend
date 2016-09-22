var express = require('express');
var router = express.Router();
var Tradesman = require('../models/tradesman');
var TradesmanLocation = require('../models/tradesmanLocation');

router.get('/tradesman/location', function (req, res, next) {
    Tradesman.findOne({
        user: req.user
    }).exec(function (err, tradesman) {

        TradesmanLocation.find({
            tradesman: tradesman
        })
            .populate('tradesman')
            .sort({ date: 'desc' })
            .exec(function (err, locations) {
                if (err) {
                    var err = new Error('Error encountered while requesting the Tradesman');
                    err.status = 500;
                    next(err);
                } else {
                    if (locations.length > 0) {
                        var currLocation = locations[0];
                        Tradesman.populate(currLocation.tradesman, { path: 'user' }, function (err, tradesman) {
                            res.send(currLocation);
                        });

                    } else {
                        var err = new Error('No Location found for requested Tradesman');
                        err.status = 500;
                        next(err);
                    }
                }
            });
    });
});

router.post('/tradesman/location', function (req, res, next) {
    Tradesman.findOne({
        user: req.user
    }).exec(function (err, tradesman) {
        if (err) {
            var err = new Error('Error encountered while requesting the Tradesman');
            err.status = 500;
            next(err);
        } else {
            if (tradesman) {

                var geoPoint = {};
                geoPoint.latitude = req.query.latitude;
                geoPoint.longitude = req.query.longitude;
                var location = new TradesmanLocation({
                    tradesman: tradesman,
                    location: geoPoint,
                    activity: req.query.activity
                });

                location.save(function (err, location) {
                    if (err) {
                        var newErr = new Error('Error updating Tradesman Location');
                        newErr.error = err;
                        newErr.status = 500;
                        next(newErr);
                    } else {
                        console.log('Setting saved location');
                        tradesman.currentLocation = location._id;
                        tradesman.save(function (err, resp) {
                            if (err) {
                                var newErr = new Error('Error updating current location for this Tradesman');
                                newErr.error = err;
                                newErr.status = 500;
                                next(newErr);
                            } else {
                                res.json({ message: 'Tradesman Current Location Updated' })
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