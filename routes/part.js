var express = require('express');
var router = express.Router();
var Part = require('../models/part');
var Service = require('../models/service');

router.post('/parts', function (req, res, next) {

    if (req.query.service) {
        Service.findOne({ _id: req.query.service }, function (err, service) {
            if (err) {
                var newErr = new Error('Error fetching requested Service');
                newErr.error = err;
                newErr.status = 500;
                next(newErr);
            } else {

                if (service) {
                    var newPart = new Part();
                    newPart.service = service;
                    newPart.save(function (err, part) {
                        if (err) {
                            var newErr = new Error('Error adding new Part to Service');
                            newErr.error = err;
                            newErr.status = 500;
                            next(newErr);
                        } else {
                            Part.findOneAndUpdate({_id: part._id }, req.query, function (err, part) {
                                if (err) {
                                    var newErr = new Error('Error adding new Part to Service');
                                    newErr.error = err;
                                    newErr.status = 500;
                                    next(newErr);
                                } else {
                                    if(part) {
                                        res.json({ success: true, message: 'New Part Added', part: part._id });
                                    }else{
                                        var newErr = new Error('Part to be updated not found');
                                        newErr.status = 500;
                                        next(newErr);
                                    }
                                }
                            });
                        }
                    });
                } else {
                    var newErr = new Error('Requested Service could not be found');
                    newErr.error = err;
                    newErr.status = 500;
                    next(newErr);
                }
            }
        });
    } else {
        var newErr = new Error('Can not create a new part without a Service. Service Id required.');
        newErr.status = 500;
        next(newErr);
    }

});
router.patch('/parts/:id', function (req, res, next) {
    Part.findOneAndUpdate({ _id: req.params.id }, req.query, function (err, part) {
        if (err) {
            var newErr = new Error('Error Updating Part');
            newErr.error = err;
            newErr.status = 500;
            next(newErr);
        } else {
            res.json({ success: true, message: 'Part Updated', part: part._id });
        }
    })

});
router.delete('/parts/:id', function (req, res, next) {
    Part.find({ _id: req.param.id }).remove().exec(function (err) {
        if (err) {
            var newErr = new Error('Error deleting part');
            newErr.error = err;
            newErr.status = 500;
            next(newErr);
        }else{
            res.json({ success: true, message: 'Part Deleted'});
        }
    })
});

module.exports = router;