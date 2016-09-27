var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Tradesman = require('../models/tradesman');
var Timeslot = require('../models/timeslot');
var Service = require('../models/service');
var ServiceSet = require('../models/serviceSet');

var Customer = require('../models/customer');
var Property = require('../models/property');
var Problem = require('../models/problem');
var CustomerProperty = require('../models/customerproperty');
var Part = require('../models/part');

router.get('/tradesman/timeslots', function (req, res, next) {
    Tradesman.findOne({
        user: req.user
    }).exec(function (err, tradesman) {
        if (err) {
            var err = new Error('Error encountered while requesting the Tradesman');
            err.status = 500;
            next(err);
        } else {
            if (tradesman) {

                Timeslot.find({
                    tradesman: tradesman
                }).populate({
                    path: 'tradesman',
                    model: Tradesman,
                    populate: { path: 'user', model: User }
                }).populate({
                    path: 'service',
                    model: Service,
                    populate: [{ path: 'serviceSet', model: ServiceSet }, { path: 'tradesman', model: Tradesman }]
                }).exec(function (err, timeslots) {
                    if (err) {
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

router.post('/tradesman/timeslot', function (req, res, next) {
    Tradesman.findOne({
        user: req.user
    }).exec(function (err, tradesman) {
        if (err) {
            var err = new Error('Error encountered while requesting the Tradesman');
            err.err = err;
            err.status = 500;
            next(err);
        } else {
            if (tradesman) {
                if (req.query.service) {
                    Service.findOne({ _id: req.query.service }).exec(function (err, service) {
                        if (err) {
                            var nErr = new Error('Error encountered while getting Service for Timeslot');
                            nErr.err = err;
                            nErr.status = 500;
                            next(nErr);
                        } else {
                            var tslot = new Timeslot();
                            tslot.tradesman = tradesman;
                            tslot.service = service;
                            if (req.query.end) {
                                tslot.end = req.query.end;
                            }
                            if (req.query.start) {
                                tslot.start = req.query.start;
                            }

                            if(req.query.type){
                                tslot.type = req.query.type;
                            }

                            tslot.slotLength = tslot.end - tslot.start;

                            tslot.save(function (err, tslot) {
                                if (err) {
                                    var nErr = new Error('Error saving Timeslot');
                                    nErr.err = err;
                                    nErr.status = 500;
                                    next(nErr);
                                } else {

                                    Timeslot.findOne({
                                        _id: tslot._id
                                    }).populate({
                                        path: 'tradesman',
                                        model: Tradesman,
                                        populate: { path: 'user', model: User }
                                    }).populate({
                                        path: 'service',
                                        model: Service,
                                        populate: [{
                                            path: 'serviceSet', model: ServiceSet, populate: {
                                                path: 'customerProperty',
                                                model: CustomerProperty,
                                                populate: [{ path: 'property', model: Property }, {
                                                    path: 'customer',
                                                    model: Customer,
                                                    populate: { path: 'user', model: User }
                                                }]
                                            }
                                        }, {
                                            path: 'tradesman',
                                            model: Tradesman,
                                            populate: { path: 'user', model: User }
                                        }]
                                    }).exec(function (err, timeslots) {
                                        if (err) {
                                            var err = new Error('Timeslots could not be found for this Tradesman');
                                            err.status = 500;
                                            next(err);
                                        } else {
                                            res.json(timeslots);
                                        }
                                    });

                                }
                            });
                        }
                    });

                } else {
                    var tslot = new Timeslot();
                    tslot.tradesman = tradesman;
                    if (req.query.end) {
                        tslot.end = req.query.end;
                    }
                    if (req.query.start) {
                        tslot.start = req.query.start;
                    }

                    tslot.slotLength = tslot.end - tslot.start;

                    tslot.save(function (err, tslot) {
                        if (err) {
                            var nErr = new Error('Error saving Timeslot');
                            nErr.err = err;
                            nErr.status = 500;
                            next(nErr);
                        } else {

                            Timeslot.findOne({
                                _id: tslot._id
                            }).populate({
                                path: 'tradesman',
                                model: Tradesman,
                                populate: { path: 'user', model: User }
                            }).populate({
                                path: 'service',
                                model: Service,
                                populate: [{ path: 'serviceSet', model: ServiceSet }, {
                                    path: 'tradesman',
                                    model: Tradesman
                                }]
                            }).exec(function (err, timeslots) {
                                if (err) {
                                    var err = new Error('Timeslots could not be found for this Tradesman');
                                    err.status = 500;
                                    next(err);
                                } else {
                                    res.json(timeslots);
                                }
                            });
                        }
                    });
                }

            } else {
                var err = new Error('Requested Tradesman could not be found');
                err.status = 500;
                next(err);
            }
        }
    });
});

router.patch('/tradesman/timeslot/:id', function (req, res, next) {
    Timeslot.findOneAndUpdate({ _id: req.params.id }, req.query, function (err, tslot) {
        if (err) {
            var newErr = new Error('Error encountered while updating the Timeslot');
            newErr.error = err;
            newErr.status = 500;
            next(newErr);
        } else {

            Timeslot.findOne({
                _id: req.params.id
            }).populate({
                path: 'tradesman',
                model: Tradesman,
                populate: { path: 'user', model: User }
            }).populate({
                path: 'service',
                model: Service,
                populate: [{ path: 'serviceSet', model: ServiceSet }, { path: 'tradesman', model: Tradesman }]
            }).exec(function (err, timeslots) {
                if (err) {
                    var err = new Error('Timeslots could not be found for this Tradesman');
                    err.status = 500;
                    next(err);
                } else {
                    res.json(timeslots);
                }
            });
        }
    });
});

router.delete('/tradesman/timeslot/:id', function (req, res, next) {

    Timeslot.find({ _id: req.params.id }).remove().exec(function (err) {
        if (err) {
            var newErr = new Error('Error deleting Timeslot');
            newErr.error = err;
            newErr.status = 500;
            next(newErr);
        } else {
            res.json({ success: true, message: 'Timeslot Deleted' });
        }
    });
});

module.exports = router;