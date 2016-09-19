var env = process.env.NODE_ENV || 'dev';
var config = require('./config')[env];

console.log("ENV:",env);

var express = require('express');
var app = express();
var mongoose = require('mongoose');
mongoose.connect(config.mongoUrl);

var mongo_express = require('mongo-express/lib/middleware');
app.use('/mongo_express', mongo_express(config.mongo_express_config));

var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

var cookieParser = require('cookie-parser');
app.use(cookieParser());

var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
app.use(bodyParser.json());
app.use(expressValidator([]));
app.use(bodyParser.urlencoded({
    extended: false
}));

var flash = require('connect-flash');
app.use(flash());

var swig = require('swig');
app.set('views', path.join(__dirname, 'views'));
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('view cache', false);
swig.setDefaults({
    cache: false
});

var passport = require('passport');
app.use(passport.initialize());

var initPassport = require('./passport/init');
initPassport(passport);

var favicon = require('serve-favicon');
var logger = require('morgan');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

var apiclient = require('./routes/apiclient');
var signup = require('./routes/signup')(passport);
var login = require('./routes/login')(passport);
var tradesman = require('./routes/tradesman');
var services = require('./routes/service');
var parts = require('./routes/part');
var timeslots = require('./routes/timeslots');
var properties = require('./routes/customerproperty');
var charge = require('./routes/charge');
var payment = require('./routes/payment');

app.use(apiclient);
app.use(signup);
app.use(login);
app.use(passport.authenticate('jwt'),tradesman);
app.use(passport.authenticate('jwt'),services);
app.use(passport.authenticate('jwt'),timeslots);
app.use(passport.authenticate('jwt'),properties);
app.use(passport.authenticate('jwt'),parts);

app.use(passport.authenticate('jwt'),charge);
app.use(passport.authenticate('jwt'),parts);


app.get('/unauthorized',function(req,res){
    res.status(401).json('Client not Authorized to access API')
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('The requested URL ' + req.url + ' not found');
    err.status = 404;
    next(err);
});

if(env === 'dev') {
    app.use(function(err, req, res, next) {
        console.log('Returning an Error Response',err.status||500, err.message);
        res.status(err.status || 500);
        
        res.json({
            message: "Error Response",
            errorMessage: err.message,
            error: err
        });
    });
} else {
    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        
        res.status(err.status || 500);
        res.json({
            message: "Error Response",
            errorMessage: err.message,
            error: err
        });
    });
}

app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});