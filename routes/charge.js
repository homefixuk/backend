var express = require('express');
var router = express.Router();
var async = require('async');
var _ = require('underscore');
var Service = require('../models/service');
var Charge = require('../models/charge');
var ServiceSet = require('../models/serviceSet');

router.post('/charge', function (req, res, next) {

    req.checkQuery('service', 'required').notEmpty();
    req.checkQuery('amount', 'required').notEmpty();
    req.checkQuery('quantity', 'required').notEmpty();
    req.checkQuery('withVat', 'required').notEmpty();
    req.checkQuery('markup', 'required').notEmpty();
    req.checkQuery('markupBeforeVat', 'required').notEmpty();

    var validationError = req.validationErrors();
    if (validationError) {
        next(validationError);
    } else {

        async.waterfall([
            function (callback) {
                Service.findOne({_id: req.query.service}, function (err, service) {
                    if (err) {
                        callback(err);
                    } else {
                        if (service) {
                            callback(null, service)
                        } else {
                            var newErr = new Error('Requested Service could not be found');
                            newErr.error = err;
                            newErr.status = 500;
                            callback(newErr);
                        }
                    }
                });
            },
            function (service, callback) {
                var newCharge = new Charge(req.query);
                newCharge.service = service;
                newCharge.save(function (err, charge) {
                    if (err) callback(err);
                    else {
                        callback(null, charge, service)
                    }
                })
            },
            function (charge, service, callback) {
                ServiceSet.findOne({_id: service.serviceSet}, function (err, ss) {
                    ss.charges.push(charge);
                    ss.save(function (err) {
                        if (err) callback(err);
                        else callback(null, charge);
                    })

                });
            }
        ], function (err, charge) {
            if (err) next(err);
            else res.json(charge)
        });


    }
});

router.patch('/charge/:id', function (req, res, next) {
    Charge.findOneAndUpdate({_id: req.params.id}, req.query, {new: true}, function (err, charge) {
        if (err) {
            next(err)
        } else {
            res.json(charge)
        }
    })
});
router.delete('/charge/:id', function (req, res, next) {
    Charge.findOne({_id: req.params.id}).exec(function (err, charge) {
        if (err) {
            var newErr = new Error('Error locating Charge');
            newErr.error = err;
            newErr.status = 500;
            next(newErr);
        } else {
            Service.findOne({_id: charge.service}, function (err, service) {
                if (err) next(err);
                else {
                    if (service) {
                        ServiceSet.findOne({_id: service.serviceSet}, function (err, serviceSet) {
                            if (err) next(err);
                            else {
                                if (serviceSet) {
                                    serviceSet.charges = _.without(serviceSet.charges, req.params.id);
                                    serviceSet.save(function (err, resp) {
                                        if (err) next(err);
                                        else {
                                            Charge.findOne({_id: req.params.id}).remove().exec(function (err) {
                                                res.json({success: true, message: 'Charge Deleted'})
                                            });
                                        }
                                    })
                                } else {
                                    var newErr = new Error('Could not find Service Set');
                                    newErr.error = err;
                                    newErr.status = 500;
                                    next(newErr);
                                }
                            }
                        })
                    } else {
                        var newErr = new Error('Could not find Service');
                        newErr.error = err;
                        newErr.status = 500;
                        next(newErr);
                    }
                }
            });
        }
    })
});

module.exports = router;