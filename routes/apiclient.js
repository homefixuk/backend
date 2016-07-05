var express = require('express');
var router = express.Router();
var restify = require('express-restify-mongoose');
var Client = require('../models/apiclient');


restify.serve(router,Client);

module.exports = router;