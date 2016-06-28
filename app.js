var env = process.env.NODE_ENV || 'dev'
var config = require('./config')[env]

console.log("ENV:",env);

var express = require('express');
var app = express();
var mongoose = require('mongoose');
mongoose.connect(config.mongoUrl);
var mongo_express = require('mongo-express/lib/middleware')
app.use('/mongo_express', mongo_express(config.mongo_express_config))
var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
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

var signup = require('./routes/signup')(passport);
var login = require('./routes/login')(passport);
var profile = require('./routes/tradesman/profile')(passport);
var client = require('./routes/client/client')(passport);
app.use(signup);
app.use(login);
app.use('/tradesman', profile);
app.use('/clients', client);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('The requested URL ' + req.url + ' not found');
    err.status = 404;
    next(err);
});

if(env === 'dev') {
    app.use(function(err, req, res, next) {

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
            errorMessage: err.message
        });
    });
}
app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});
//module.exports = app;