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
var Timeslot = require('../models/timeslot');

router.post('/services', function (req, res, next) {

    req.checkQuery('customerEmail', 'required').notEmpty();
    req.checkQuery('customerPhone', 'required').notEmpty();
    req.checkQuery('customerName', 'required').notEmpty();

    req.checkQuery('addressLine1', 'required').notEmpty();
    req.checkQuery('postcode', 'required').notEmpty();
    req.checkQuery('country', 'required').notEmpty();

    req.checkQuery('problemName', 'required').notEmpty();
    req.checkQuery('startTime', 'required').notEmpty();

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

                    async.waterfall([
                            //find or create customer user
                            function (callback) {
                                var newUser = {
                                    email: req.query.customerEmail,
                                    mobile: req.query.customerPhone,
                                    firstName: req.query.customerName,
                                    password: shortid.generate()
                                };
                                User.findOneAndUpdate({ email: req.query.customerEmail }, newUser, {
                                    upsert: true,
                                    new: true
                                }, function (err, user) {
                                    if (err) {
                                        callback(err, null)
                                    } else {
                                        callback(null, user)
                                    }
                                });
                            },
                            //find or create customer
                            function (user, callback) {
                                var newCustomer = { user: user };
                                Customer.findOneAndUpdate({ user: user }, newCustomer, {
                                    upsert: true,
                                    new: true
                                }, function (custSaveErr, customer) {
                                    if (custSaveErr) {
                                        callback(custSaveErr)
                                    } else {
                                        callback(null, customer)
                                    }
                                });
                            },
                            //find or create property
                            function (customer, callback) {
                                Property.findOneAndUpdate({
                                    addressLine1: req.query.addressLine1,
                                    postcode: req.query.postcode,
                                    country: req.query.country
                                }, req.query, { upsert: true, new: true }, function (propSaveErr, property) {
                                    if (propSaveErr) {
                                        callback(propSaveErr, null);
                                    } else {
                                        callback(null, property, customer);
                                    }
                                });
                            },
                            //find or create customerproperty
                            function (property, customer, callback) {
                                var newCustomerProperty = {
                                    customer: customer,
                                    property: property,
                                    type: req.query.customerPropertyRelationship
                                };
                                CustomerProperty.findOneAndUpdate({
                                    customer: customer,
                                    property: property
                                }, newCustomerProperty, { upsert: true, new: true }, function (custPropSaveErr, cP) {
                                    if (custPropSaveErr) {
                                        callback(custPropSaveErr)
                                    } else {
                                        callback(null, cP)
                                    }
                                });
                            },
                            //find or create problem
                            function (cP, callback) {
                                var newProblem = { name: req.query.problemName };
                                Problem.findOneAndUpdate(newProblem, newProblem, {
                                    upsert: true,
                                    new: true
                                }, function (probSaveErr, problem) {

                                    if (probSaveErr) {
                                        callback(probSaveErr, null);
                                    } else {
                                        callback(null, problem, cP);
                                    }
                                });
                            },
                            //find or create serviceset
                            function (problem, cP, callback) {
                                var newServiceSet = { customerProperty: cP };
                                ServiceSet.findOneAndUpdate(newServiceSet, newServiceSet, {
                                    upsert: true,
                                    new: true
                                }, function (serviceSetErr, serviceset) {
                                    if (serviceSetErr) {
                                        callback(serviceSetErr)
                                    } else {
                                        callback(null, serviceset, problem)
                                    }
                                });

                            },
                            //create new service
                            function (serviceset, problem, callback) {
                                var newService = new Service();
                                newService.tradesman = tradesman;
                                newService.serviceSet = serviceset;
                                newService.problem = problem;
                                newService.save(function (serviceErr, service) {
                                    if (serviceErr) {
                                        callback(serviceErr)
                                    }
                                    else {
                                        callback(null, service);
                                    }
                                })
                            }
                        ],
                        //populate service
                        function (asynWaterfallErr, service) {
                            if (asynWaterfallErr) {
                                next(asynWaterfallErr)
                            } else {
                                ServiceSet.populate(service.serviceSet, { path: 'customerProperty' }, function (err, obj) {
                                    CustomerProperty.populate(obj.customerProperty, { path: 'customer property' }, function (err, custProp) {
                                        Customer.populate(custProp.customer, { path: 'user' }, function (err, customer) {

                                            Tradesman.populate(service.tradesman, { path: 'user currentLocation' }, function (err, tradesman) {
                                                if (err) {
                                                    next(err);
                                                } else {
                                                    res.json(service);
                                                }
                                            });
                                        });
                                    });
                                })
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
                Service
                    .find({})
                    .sort({ 'created': -1 })
                    .limit(parseInt(req.query.limit))
                    .skip(parseInt(req.query.skip))
                    .populate({
                        path: 'tradesman',
                        model: Tradesman,
                        populate: { path: 'user', model: User }
                    })
                    .populate({
                        path: 'problem',
                        model: Problem
                    })
                    .populate({
                        path: 'serviceSet',
                        model: ServiceSet,
                        populate: {
                            path: 'customerProperty',
                            model: CustomerProperty,
                            populate: [{ path: 'property', model: Property }, {
                                path: 'customer',
                                model: Customer,
                                populate: { path: 'user', model: User }
                            }]
                        }
                    })
                    .exec(function (err, services) {

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
            } else {
                var err = new Error('Requested Tradesman could not be found');
                err.status = 500;
                next(err);
            }
        }
    });
});

router.get('/service/next', function (req, res, next) {
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
                var now = Date.now();
                Timeslot
                    .find({
                        tradesman: tradesman,
                        start: { $gt: now }
                    })
                    .sort('start')
                    .populate({
                        path: 'tradesman',
                        model: Tradesman,
                        populate: { path: 'user', model: User }
                    })
                    .populate({
                        path: 'service',
                        model: Service,
                        populate: [{ path: 'serviceSet', model: ServiceSet,populate:{path:'customerProperty',model:CustomerProperty,populate:[{path:'customer',model:Customer,populate:{path:'user',model:User}},{path:'property',model:Property}]} },
                            { path: 'tradesman', model: Tradesman,populate:{path:'user',model:User} },{ path: 'problem', model: Problem }]
                    })
                    .exec(function (err, timeslots) {
                        if (err) {
                            var err = new Error('Timeslots could not be found for this Tradesman');
                            err.status = 500;
                            next(err);
                        } else {
                            if(timeslots.length >0) {
                                res.json(timeslots[0]);
                            }else{
                                res.json({message:"No timeslots with start time greater than " + now + " found for this tradesman"});
                            }
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

router.get('/service/current', function (req, res, next) {
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
                var now = Date.now();
                Timeslot
                    .find({
                        tradesman: tradesman,
                        start: { $lt: now  },
                        end: { $gt: now }
                    })
                    .sort('start')
                    .populate({
                        path: 'tradesman',
                        model: Tradesman,
                        populate: { path: 'user', model: User }
                    })
                    .populate({
                        path: 'service',
                        model: Service,
                        populate: [{ path: 'serviceSet', model: ServiceSet,populate:{path:'customerProperty',model:CustomerProperty,populate:[{path:'customer',model:Customer,populate:{path:'user',model:User}},{path:'property',model:Property}]} },
                            { path: 'tradesman', model: Tradesman,populate:{path:'user',model:User}},{ path: 'problem', model: Problem }]
                    })
                    .exec(function (err, timeslots) {
                        if (err) {
                            var err = new Error('Timeslots could not be found for this Tradesman');
                            err.status = 500;
                            next(err);
                        } else {
                            if(timeslots.length >0) {
                                res.json(timeslots[0]);
                            }else{
                                res.json({message:"No timeslots with start time less than " + now + " and end time greater than " + now + " found for this tradesman"});
                            }
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

router.get('/service/:id', function (req, res, next) {
    Service.findOne({ _id: req.params.id })
        .populate({ path: 'serviceSet' })
        .exec(function (err, service) {
            if (err) {
                next(err);
            } else {
                if (service) {
                    ServiceSet.populate(service.serviceSet, { path: 'customerProperty payments charges' }, function (err, obj) {
                        if (err)
                            next(err);
                        else {
                            CustomerProperty.populate(obj.customerProperty, { path: 'customer property' }, function (err, custProp) {
                                Customer.populate(custProp.customer, { path: 'user' }, function (err, customer) {
                                    res.json(service);
                                });
                            });
                        }
                    });

                } else {
                    var newErr = new Error('Could not get the requested Service');
                    newErr.status = 500;
                    next(newErr);
                }
            }

        });
});

router.patch('/service/:id', function (req, res, next) {
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

router.delete('/service/:id', function (req, res, next) {
    Service.findOne({ _id: req.params.id }).exec(function (err, service) {
        if (err) {
            var newErr = new Error('Error deleting Service');
            newErr.error = err;
            newErr.status = 500;
            next(newErr);
        } else {
            if (service) {

                Service.find({ serviceSet: service.serviceSet }).exec(function (err, services) {
                    console.log(services.length);
                    if (services.length == 1) {
                        var ssId = service.serviceSet;
                        Service.find({ _id: req.params.id }).remove().exec(function (err) {
                            ServiceSet.find({ _id: ssId }).remove().exec(function (err) {
                                res.json({ success: true, message: 'Service Deleted' });
                            })
                        })
                    } else {
                        Service.find({ _id: req.params.id }).remove().exec(function (err, service) {
                            res.json({ success: true, message: 'Service Deleted' });
                        });
                    }
                })

            }

        }
    });
});



module.exports = router;