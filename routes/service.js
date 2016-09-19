var express = require('express');
var router = express.Router();
var async = require('async');
var shortid = require('shortid');

var Tradesman = require('../models/tradesman');
var User = require('../models/user');
var Customer = require('../models/customer');
var Property = require('../models/property');
var Problem = require('../models/problem');
var CustomerProperty = require('../models/customerproperty');
var ServiceSet = require('../models/serviceSet');
var Service = require('../models/service');
var Part = require('../models/part');

router.post('/services', function (req, res, next) {

    req.checkQuery('customerEmail', 'required').notEmpty();
    req.checkQuery('customerPhone', 'required').notEmpty();
    req.checkQuery('customerName', 'required').notEmpty();

    var validationError = req.validationErrors();
    if (validationError) {
        next(validationError);
    } else {

        Tradesman.findOne({
            user: req.user
        }).exec(function (err, tradesman) {
            if (err) {
                var err = new Error('Error encounter while getting the logged in Tradesman');
                err.message = err.message;
                err.status = 500;
                next(err);
            }
            else {
                if (tradesman) {

                    async.parallel([function (callback) {
                        //find or create user, customer
                        var newUser = {
                            email: req.query.customerEmail,
                            mobile: req.query.customerPhone,
                            firstName: req.query.customerName,
                            password: shortid.generate()
                        };
                        User.findOneAndUpdate({ email: req.query.customerEmail }, newUser, { upsert: true }, function (err, user) {
                            if (err) {
                                callback(err, null)
                            } else {
                                var newCustomer = { user: user };
                                Customer.findOneAndUpdate({ user: user }, newCustomer, { upsert: true }, function (err, customer) {
                                    callback(err, customer)
                                });
                            }
                        });

                    }, function (callback) {
                        //find or create property
                        Property.findOneAndUpdate({
                            addressLine1: req.query.addressLine1,
                            postcode: req.query.postcode,
                            country: req.query.country
                        }, req.query, { upsert: true }, function (err, property) {
                            callback(err, property);
                        });
                    }, function (callback) {
                        //find or create problem
                        var newProblem = { name: req.query.problemName };
                        Problem.findOneAndUpdate(newProblem, newProblem, { upsert: true }, function (err, problem) {
                            callback(err, problem);
                        });
                    }], function (err, result) {

                        if (err) {
                            next(err)
                        } else {
                            async.parallel([function (callback) {
                                //find or create customerproperty
                                var newCustomerProperty = {
                                    customer: result[0],
                                    property: result[1],
                                    type: req.query.customerPropertyRelationship
                                };
                                CustomerProperty.findOneAndUpdate({
                                    customer: result[0],
                                    property: result[1]
                                }, newCustomerProperty, { upsert: true }, function (err, customerproperty) {
                                    callback(err, customerproperty);
                                });
                            }], function (err, result2) {
                                //find or create serviceset
                                var newServiceSet = { customerProperty: result2[0] };
                                ServiceSet.findOneAndUpdate(newServiceSet, newServiceSet, { upsert: true }, function (err, serviceset) {
                                    if (err) {
                                        next(err)
                                    } else {
                                        //create service
                                        var newService = new Service();
                                        newService.tradesman = tradesman;
                                        newService.serviceSet = serviceset;
                                        newService.problem = result[2];
                                        newService.save(function (err, service) {
                                            if (err) next(err);
                                            else res.json(service);
                                        })
                                    }
                                });
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
    }

});

router.get('/services', function (req, res, next) {
    Service.find({}).exec(function (err, services) {

        if (err) {
            var newErr = new Error('Error encountered while getting services.');
            newErr.message = err.message;
            newErr.status = 500;
            next(newErr);
        } else {
            if (services) {
                res.json(services);
            } else {
                var newErr = new Error('Could not get services from database');
                newErr.status = 500;
                next(newErr);
            }
        }

    });
});

router.get('/services/:id', function (req, res, next) {
    Service.find({ _id: req.params.id }).exec(function (err, service) {
        if (err) {
            var newErr = new Error('Error encountered while getting Service.');
            newErr.message = err.message;
            newErr.status = 500;
            next(newErr);
        } else {
            if (service) {
                res.json(service);
            } else {
                var newErr = new Error('Could not get the requested Service');
                newErr.status = 500;
                next(newErr);
            }
        }

    });
});

router.patch('/services/:id', function (req, res, next) {
    Service.findOneAndUpdate({
        _id: req.params.id
    }, req.query, function (err, service) {
        if (err) {
            var newErr = new Error('Error encountered while updating the Service');
            newErr.error = err;
            newErr.status = 500;
            next(newErr);
        } else {
            res.send(service)
        }
    });
});

router.get('/services/:id/problem', function (req, res, next) {
    Service.findOne({
        _id: req.params.id
    }).exec(function (err, service) {
        if (err) {
            var nErr = new Error('Error getting requested Service');
            nErr.err = err;
            nErr.status = 500;
            next(nErr);
        } else {
            if (service) {
                Problem.findOne({ _id: service.problem }).exec(function (err, problem) {
                    if (err) {
                        var nErr = new Error('Error getting Problem for requested Service');
                        nErr.err = err;
                        nErr.status = 500;
                        next(nErr);
                    } else {
                        res.json(problem);
                    }
                })
            } else {
                var nErr = new Error('Requested Service could not be found');
                nErr.status = 500;
                next(nErr);
            }
        }
    });
});

router.post('/services/:id/problem/parts/:id', function (req, res, next) {

    Service.findOne({
        _id: req.params.id
    }).exec(function (err, service) {
        if (err) {
            var nErr = new Error('Error getting requested Service');
            nErr.err = err;
            nErr.status = 500;
            next(nErr);
        } else {
            if (service) {
                Problem.findOne({ _id: service.problem }).exec(function (err, problem) {
                    if (err) {
                        var nErr = new Error('Error getting Problem for requested Service');
                        nErr.err = err;
                        nErr.status = 500;
                        next(nErr);
                    } else {

                        Part.findOne({ _id: req.params.id }).exec(function (err, part) {
                            if (err) {
                                var nErr = new Error('Error getting requested Part.');
                                nErr.status = 500;
                                next(nErr);
                            } else {
                                if (part) {
                                    problem.potentialParts.push(part);
                                    problem.save(function (err, problem) {
                                        if (err) {
                                            var nErr = new Error('Error adding parts to Problem');
                                            nErr.err = err;
                                            nErr.status = 500;
                                            next(nErr);

                                        } else {
                                            res.json({
                                                success: true,
                                                message: 'Parts added to the problem',
                                                problem: problem._id
                                            });
                                        }
                                    });
                                } else {
                                    var nErr = new Error('Requested Part could not be found');
                                    nErr.status = 500;
                                    next(nErr);
                                }
                            }
                        });
                    }
                });
            } else {
                var nErr = new Error('Requested Service could not be found');
                nErr.status = 500;
                next(nErr);
            }
        }
    });
});

module.exports = router;