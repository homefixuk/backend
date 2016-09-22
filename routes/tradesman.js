var express = require('express');
var router = express.Router();
var Tradesman = require('../models/tradesman');
var TradesmanPrivate = require('../models/tradesmanPrivate');
var TradesmanLocation = require('../models/tradesmanLocation');
var User = require('../models/user');

router.get('/tradesman/me', function (req, res, next) {
    Tradesman.findOne({
        user: req.user
    })
        .populate('currentLocation')
        .populate('user')
        .exec(function (err, tradesman) {
            if (err) {
                var err = new Error('Error encountered while requesting the Tradesman');
                err.status = 500;
                next(err);
            } else {
                if (tradesman) {
                    res.send(tradesman);
                } else {
                    var err = new Error('Requested Treadesman could not be found');
                    err.status = 500;
                    next(err);
                }
            }
        });
});
router.get('/tradesman/me/private', function (req, res, next) {
    Tradesman.findOne({
        user: req.user
    }).exec(function (err, tradesman) {
        if (err) {
            var err = new Error('Error encountered while requesting the Tradesman');
            err.status = 500;
            next(err);
        } else {
            if (tradesman) {
                TradesmanPrivate.findOne({
                    tradesman: tradesman
                }).populate('tradesman').exec(function (err, tradesmanPrivate) {
                    if (err) {
                        var err = new Error('Private Details could not be found for this Treadesman');
                        err.status = 500;
                        next(err);
                    } else {

                        Tradesman.populate(tradesmanPrivate.tradesman,{path:'user currentLocation'}, function (err, tradesman) {
                            if (err) {
                                next(err);
                            } else {
                                res.json(tradesmanPrivate);
                            }
                        });


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
router.patch('/tradesman/me', function (req, res, next) {
    Tradesman.findOneAndUpdate({
        user: req.user
    }, req.query, function (err, tradesman) {
        if (err) {
            var newErr = new Error('Error encountered while updating the Tradesman');
            newErr.error = err;
            newErr.status = 500;
            next(newErr);
        } else {
            User.findOneAndUpdate({_id: tradesman.user}, req.query, function (err, user) {
                if (err) {
                    next(err)
                } else {
                    Tradesman.findOne({user: req.user})
                        .populate('currentLocation')
                        .populate('user')
                        .exec(function (err, t2) {
                            if (err) {
                                next(err)
                            } else {
                                res.send(t2)

                            }
                        });
                }

            });
        }
    });
});
router.patch('/tradesman/me/private', function (req, res, next) {
    Tradesman.findOne({
        user: req.user
    }).exec(function (err, tradesman) {
        if (err) {
            var err = new Error('Error encountered while requesting the Tradesman');
            err.status = 500;
            next(err);
        } else {
            if (tradesman) {
                TradesmanPrivate.findOneAndUpdate({
                    tradesman: tradesman
                }, req.query, function (err, tradesmanPrivate) {
                    if (err) {
                        var newErr = new Error('Private Details could not be updated for this Tradesman');
                        newErr.error = err;
                        newErr.status = 500;
                        next(newErr);
                    } else {
                        res.json({message: 'Tradesman Private Details Updated'})
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