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
var Payment = require('../models/payment');
var Charge = require('../models/charge');

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
                    populate: [{ path: 'problem', model: Problem }, {
                        path: 'serviceSet',
                        model: ServiceSet,
                        populate: [{
                            path: 'customerProperty',
                            model: CustomerProperty,
                            populate: [{
                                path: 'customer',
                                model: Customer,
                                populate: { path: 'user', model: User }
                            }, { path: 'property', model: Property }]
                        }, { path: 'charges', model: Charge }, { path: 'payments', model: Payment }]
                    }, { path: 'tradesman', model: Tradesman, populate: { path: 'user', model: User } }]
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

                            if (req.query.type) {
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
                                        populate: [
                                            { path: 'problem', model: Problem },
                                            {
                                                path: 'serviceSet',
                                                model: ServiceSet,
                                                populate: [{
                                                    path: 'customerProperty',
                                                    populate: [{ path: 'property', model: Property }, {
                                                        path: 'customer',
                                                        model: Customer,
                                                        populate: { path: 'user', model: User }
                                                    }]
                                                }, { path: 'charges', model: Charge }, {
                                                    path: 'payments',
                                                    model: Payment
                                                }]
                                            },
                                            {
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

                    if (req.query.type) {
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
                                populate: [
                                    { path: 'problem', model: Problem },
                                    {
                                        path: 'serviceSet',
                                        model: ServiceSet,
                                        populate: {
                                            path: 'customerProperty',
                                            populate: [{ path: 'property', model: Property }, {
                                                path: 'customer',
                                                model: Customer,
                                                populate: { path: 'user', model: User }
                                            }]
                                        }
                                    },
                                    { path: 'tradesman', model: Tradesman, populate: { path: 'user', model: User } }
                                ]
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

            if (tslot) {

                Service.findOneAndUpdate({ _id: tslot.service }, req.query, function (err, service) {

                    if (service) {

                        Problem.findOneAndUpdate({ _id: service.problem }, req.query, function (err, prob) {
                        });
                        ServiceSet.findOneAndUpdate({ _id: service.serviceSet }, req.query, { new: true }, function (err, ss) {
                            CustomerProperty.findOneAndUpdate({ _id: ss.customerProperty }, req.query, function (err, cProp) {
                                Property.findOneAndUpdate({ _id: cProp.property }, req.query, function (ee, prop) {
                                    Customer.findOneAndUpdate({ _id: cProp.customer }, req.query, function (err, cust) {
                                        User.findOneAndUpdate({ _id: cust.user }, req.query, function (err, user) {

                                            Timeslot.findOne({
                                                _id: req.params.id
                                            }).populate({
                                                path: 'tradesman',
                                                model: Tradesman,
                                                populate: { path: 'user', model: User }
                                            }).populate({
                                                path: 'service',
                                                model: Service,
                                                populate: [
                                                    {
                                                        path: 'serviceSet', model: ServiceSet, populate: [{
                                                        path: 'customerProperty',
                                                        model: CustomerProperty,
                                                        populate: [{
                                                            path: 'customer',
                                                            model: Customer,
                                                            populate: { path: 'user', model: User }
                                                        }, { path: 'property', model: Property }]
                                                    },
                                                        { path: 'payments', model: Payment }, {
                                                            path: 'charges',
                                                            mode: Charge
                                                        }]
                                                    },
                                                    {
                                                        path: 'tradesman',
                                                        model: Tradesman,
                                                        populate: [{ path: 'user', model: User }]
                                                    },
                                                    { path: 'problem', model: Problem }]
                                            }).exec(function (err, timeslots) {
                                                if (err) {
                                                    var err = new Error('Timeslots could not be found for this Tradesman');
                                                    err.status = 500;
                                                    next(err);
                                                } else {
                                                    res.json(timeslots);
                                                }
                                            });

                                        });
                                    });
                                })
                            });
                        });

                    } else {
                        var newErr = new Error('Error encountered while getting back the updated Service.');
                        newErr.status = 500;
                        next(newErr);
                    }

                });

            }
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