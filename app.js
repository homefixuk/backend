var env = process.env.NODE_ENV || 'dev'
var config = require('./config')[env]
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
var expressSession = require('express-session');
app.use(expressSession({
    secret: 'mySecretKey',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true
    }
}));
app.use(passport.initialize());
app.use(passport.session());
var initPassport = require('./passport/init');
initPassport(passport);
var favicon = require('serve-favicon');
var logger = require('morgan');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

var index = require('./routes/index')(passport);
var tradesman = require('./routes/tradesman/tradesman')(passport);
var client = require('./routes/client/client')(passport);
app.use('/', index);
app.use('/tradesman', tradesman);
app.use('/clients', client);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// development error handler
// will print stacktrace
if(env === 'dev') {
    app.use(function(err, req, res, next) {
        console.log("Dev Error Handler", err);
        res.status(err.status || 500);
        res.status(500).json({
            message: "Error",
            errorMessage: err.message,
            error: err
        });
    });
} else {
    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        console.log("Prod Error Handler", err);
        res.status(err.status || 500);
        res.render('error', {
            message: "Error",
            error: err.message
        });
    });
}
app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});
//module.exports = app;