var express = require('express');
var router = express.Router();
var Payment = require('../models/payment');
var Service = require('../models/service');

router.post('/payment', function (req, res, next) {

    var validationError = req.validationErrors();
    if (validationError) {
        next(validationError);
    } else {

        Service.findOne({ _id: req.query.service }, function (err, service) {
            if (err) {
                next(err);
            } else {
                if (service) {
                }else{
                    var newErr = new Error('Requested Service could not be found');
                    newErr.error = err;
                    newErr.status = 500;
                    next(newErr);
                }
            }
        });
    }


});
router.patch('/payment/:id', function (req, res, next) {});
router.delete('/payment/:id', function (req, res, next) {});

module.exports = router;