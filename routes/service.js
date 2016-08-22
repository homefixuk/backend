var express = require('express');
var router = express.Router();
var Tradesman = require('../models/tradesman');
var Service = require('../models/service');
var Problem = require('../models/problem');
var Part = require('../models/part');

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

router.post('/services', function (req, res, next) {
    Tradesman.findOne({
        user: req.user
    }).exec(function (err, tradesman) {
        if (err) {
            var err = new Error('Error encounter while getting the logged in Tradesman');
            err.message = err.message;
            err.status = 500;
            next(err);
        } else {
            if (tradesman) {
                if (req.query.problem) {
                    var newProblem = new Problem();
                    newProblem.description = req.query.problem;
                    newProblem.save(function (err, problem) {
                        var newService = new Service();
                        newService.problem = problem;
                        newService.tradesman = tradesman;
                        if (req.query.status) {
                            newService.status = req.query.status;
                        }
                        newService.save(function (err, service) {
                            if (err) {
                                var newErr = new Error('Error creating new service.');
                                newErr.error = err;
                                newErr.status = 500;
                                next(newErr);
                            } else {
                                res.json({ success: true, message: 'New Service Created', service: service._id });
                            }
                        });
                    })
                } else {
                    var newErr = new Error('Could not create new Service. Problem required.');
                    newErr.status = 500;
                    next(newErr);
                }
            } else {
                var err = new Error('Requested Tradesman could not be found');
                err.status = 500;
                next(err);
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