var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var passport = require('passport');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
require('./models/models.js');

var index = require('./routes/index');
var api = require('./routes/api');
var authenticate = require('./routes/authenticate')(passport);

var mongoose = require('mongoose');


if(process.env.DEV_ENV){
  //connect to mongodb (local - dev)
  mongoose.connect("mongodb://localhost:27017/saydoctor");
}else{
  // real mongodb url
  mongoose.connect("mongodb://localhost:27017/saydoctor");
}



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(session({
  secret:'stephen job'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());


//// Initialize Models
var mongoose = require('mongoose');
//// Initialize Passport
var initPassport = require('./passport-init');
initPassport(passport);



app.use('/', index);
app.use('/api', api);
app.use('/auth', authenticate);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;