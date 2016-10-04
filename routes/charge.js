var express = require('express');
var router = express.Router();
var async = require('async');
var _ = require('underscore');

var User = require('../models/user');
var Tradesman = require('../models/tradesman');
var Service = require('../models/service');
var ServiceSet = require('../models/serviceSet');
var Customer = require('../models/customer');
var Property = require('../models/property');
var Problem = require('../models/problem');
var CustomerProperty = require('../models/customerproperty');
var Payment = require('../models/payment');
var Charge = require('../models/charge');

router.get('/charge/:id', function (req, res, next) {
    Charge
        .findOne({ _id: req.params.id })
        .populate({
            path: 'service',
            model: Service,
            populate: [{path: 'problem', model: Problem}, {
                path: 'serviceSet',
                model: ServiceSet,
                populate:[ {
                    path: 'customerProperty',
                    model: CustomerProperty,
                    populate: [{
                        path: 'customer',
                        model: Customer,
                        populate: {path: 'user', model: User}
                    }, {path: 'property', model: Property}]
                },{path:'charges',model:Charge},{path:'payments',model:Payment}]
            }, {path: 'tradesman', model: Tradesman, populate: {path: 'user', model: User}}]
        })
        .exec(function (err, charge) {
        if (err) {
            next(err)
        } else {
            res.json(charge)
        }
    })
});

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
                Service.findOne({ _id: req.query.service }, function (err, service) {
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
                ServiceSet.findOne({ _id: service.serviceSet }, function (err, ss) {
                    ss.charges.push(charge);
                    ss.totalCost = ss.totalCost + charge.amount;
                    ss.save(function (err) {
                        if (err) callback(err);
                        else callback(null, charge);
                    })

                });
            }
        ], function (err, charge) {
            if (err){
                next(err);
            }
            else{
                Charge
                    .findOne({ _id: charge._id })
                    .populate({
                        path: 'service',
                        model: Service,
                        populate: [{path: 'problem', model: Problem}, {
                            path: 'serviceSet',
                            model: ServiceSet,
                            populate:[ {
                                path: 'customerProperty',
                                model: CustomerProperty,
                                populate: [{
                                    path: 'customer',
                                    model: Customer,
                                    populate: {path: 'user', model: User}
                                }, {path: 'property', model: Property}]
                            },{path:'charges',model:Charge},{path:'payments',model:Payment}]
                        }, {path: 'tradesman', model: Tradesman, populate: {path: 'user', model: User}}]
                    })
                    .exec(function (err, charge) {
                        if (err) {
                            next(err)
                        } else {
                            res.json(charge)
                        }
                    })
            }
        });

    }
});

router.patch('/charge/:id', function (req, res, next) {
    
    
    
    Charge.findOneAndUpdate({ _id: req.params.id }, req.query, { new: false }, function (err, charge) {
        if (err) {
            next(err)
        } else {
            
            if(charge){
                if(req.query.amount)

                Service.findOne({ _id: charge.service }, function (err, service) {
                    
                    if(service){

                        ServiceSet.findOne({ _id: service.serviceSet }, function (err, ss) {
                            
                            ss
                        });
                        
                    }
                    
                    
                });
                
            }
            
            
            Charge
                .findOne({ _id: charge._id })
                .populate({
                    path: 'service',
                    model: Service,
                    populate: [{path: 'problem', model: Problem}, {
                        path: 'serviceSet',
                        model: ServiceSet,
                        populate:[ {
                            path: 'customerProperty',
                            model: CustomerProperty,
                            populate: [{
                                path: 'customer',
                                model: Customer,
                                populate: {path: 'user', model: User}
                            }, {path: 'property', model: Property}]
                        },{path:'charges',model:Charge},{path:'payments',model:Payment}]
                    }, {path: 'tradesman', model: Tradesman, populate: {path: 'user', model: User}}]
                })
                .exec(function (err, charge) {
                    if (err) {
                        next(err)
                    } else {
                        res.json(charge)
                    }
                })
        }
    })
});

router.delete('/charge/:id', function (req, res, next) {
    Charge.findOne({ _id: req.params.id }).exec(function (err, charge) {
        if (err) {
            var newErr = new Error('Error locating Charge');
            newErr.error = err;
            newErr.status = 500;
            next(newErr);
        } else {
            Service.findOne({ _id: charge.service }, function (err, service) {
                if (err) next(err);
                else {
                    if (service) {
                        ServiceSet.findOne({ _id: service.serviceSet }, function (err, serviceSet) {
                            if (err) next(err);
                            else {
                                if (serviceSet) {
                                    serviceSet.totalCost = serviceSet.totalCost - charge.amount;
                                    serviceSet.charges = _.without(serviceSet.charges, req.params.id);
                                    serviceSet.save(function (err, resp) {
                                        if (err) next(err);
                                        else {
                                            Charge.findOne({ _id: req.params.id }).remove().exec(function (err) {
                                                res.json({ success: true, message: 'Charge Deleted' })
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