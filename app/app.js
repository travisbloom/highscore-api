var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var response = require('./routes/standard-response');
var facebook = require('./routes/facebook');
var log = require('./logger');
var config = require('../config');

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());

//health check for elb
app.use('/health', function(req, res) {
  res.sendStatus(200);
});
app.use('/facebook', facebook);

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
    log.error('Server Thrown Error', {error: err});
    var error = config.appEnv === 'prod' ? null : err;
    response.error(res, {
      status: 500,
      internalMessage: 'There was an error with your request, please try again later'
    })
  });


module.exports = app;
