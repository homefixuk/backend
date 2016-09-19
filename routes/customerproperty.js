var express = require('express');
var router = express.Router();
var CustomerProperty = require('../models/customerproperty');

router.get('/properties', function (req, res, next) {

    CustomerProperty.find({}).populate({path:'customer property'}).exec(function(err,props){
        res.json(props);
    });
});

module.exports = router;