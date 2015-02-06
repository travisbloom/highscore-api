var express = require('express');
var session = require('express-session')
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var response = require('./factories/standard-response');
var log = require('./logger');
var config = require('../config');

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
//todo add redis so session storage is not just server side
app.use(session({
  secret: 'keyboard cat',
  saveUninitialized: false,
  resave: false
}));
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());

//health check for elb
app.use('/health', function(req, res) { res.sendStatus(200); });
app.use('/facebook', require('./routes/providers/facebook'));
app.use('/twitter', require('./routes/providers/twitter'));
app.use('/oauth1', require('./routes/oauth1').router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  response.error(res, {
    status: 404,
    internalMessage: 'The route specified does not exist',
    details: {requestedUrl: req.originalUrl}
  })
});

// error handlers

// development error handler
// will print stacktrace
  app.use(function(err, req, res, next) {
    console.log(err)
    log.error('Server Thrown Error', {error: err});
    var error = config.appEnv === 'prod' ? null : err;
    response.error(res, {
      status: 500,
      internalMessage: 'There was an error with your request, please try again later',
      details: error
    })
  });


module.exports = app;
