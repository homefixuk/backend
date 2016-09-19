var express = require('express');
var router = express.Router();
var _ = require('underscore');

var Payment = require('../models/payment');
var Service = require('../models/service');
var ServiceSet = require('../models/serviceSet');

router.post('/payment', function (req, res, next) {
    req.checkQuery('serviceSet', 'required').notEmpty();
    req.checkQuery('amount', 'required').notEmpty();
    var validationError = req.validationErrors();
    if (validationError) {
        next(validationError);
    } else {
        ServiceSet.findOne({_id: req.query.serviceSet}, function (err, serviceSet) {
            if (err) {
                next(err);
            } else {
                if (serviceSet) {
                    var newPayment = new Payment(req.query);
                    newPayment.serviceSet = serviceSet;
                    newPayment.save(function (err, payment) {
                        if (err) next(err);
                        else {
                            serviceSet.payments.push(payment._id);
                            serviceSet.save(function (err, ss) {
                                res.json(payment);
                            });
                        }
                    })
                } else {
                    var newErr = new Error('Requested Service Set could not be found');
                    newErr.error = err;
                    newErr.status = 500;
                    next(newErr);
                }
            }
        });
    }
});

router.patch('/payment/:id', function (req, res, next) {
    Payment.findOneAndUpdate({_id: req.params.id}, req.query, {new: true}, function (err, payment) {
        if (err) {
            next(err)
        } else {
            res.json(payment)
        }
    })
});

router.delete('/payment/:id', function (req, res, next) {
    Payment.findOne({_id: req.params.id}).exec(function (err, payment) {
        if (err) {
            var newErr = new Error('Error locating Payment');
            newErr.error = err;
            newErr.status = 500;
            next(newErr);
        } else {
            ServiceSet.findOne({_id: payment.serviceSet}, function (err, serviceSet) {
                if (err) next(err);
                else {
                    if (serviceSet) {
                        serviceSet.payments = _.without(serviceSet.payments, req.params.id);
                        serviceSet.save(function (err, resp) {
                            if (err) next(err);
                            else {
                                Payment.findOne({_id: req.params.id}).remove().exec(function (err) {
                                    res.json({success: true, message: 'Payment Deleted'})
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
        }
    })
});

module.exports = router;