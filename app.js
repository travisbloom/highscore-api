var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var response = require('./routes/standard-response');
var facebook = require('./routes/facebook');
var config = require('./config');

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());

//app.use(cors()); // enable pre-flight request for DELETE request
//health check for elb
app.use('/health', function(req, res){
  res.send(200);
});
app.use('/facebook', facebook);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log('test');
  response.error(res, {
    status: 404,
    internalMessage: 'The route specified does not exist'
  })
});

// error handlers

// development error handler
// will print stacktrace
  app.use(function(err, req, res, next) {
    var error = config.appEnv === 'prod' ? null : err;
      res.status(err.status || 500);
      res.json({
          message: err.message,
          error: error
      });
  });


module.exports = app;
