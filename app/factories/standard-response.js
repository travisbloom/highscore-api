var log = require('../logger');
var jwt = require('jwt-simple');
var config = require('../../config');

exports.error = function(res, errObj) {
  log.warn('error sent to client', errObj);
  res.status(errObj.status || 500).json({
    userMessage: errObj.userMessage || 'There was an error with your request, please try again later',
    internalMessage: errObj.internalMessage || this.userMessage,
    details: errObj.details || null
})
};

exports.returnScore = function(res, returnedJSON) {
  var metaData = returnedJSON.metaData || {};
  metaData.reqTimestamp = new Date().toJSON();
    res.json({
    score: returnedJSON.score,
    metaData: metaData
  })
};

exports.returnAuthToken = function(res, authObj) {
  var response = {
    access_token: authObj.access_token
  };
  if (authObj.access_token_secret) response.access_token_secret = authObj.access_token_secret;
  if (authObj.expires) response.expires = authObj.expires;
  res.json({jwt: jwt.encode(response, config.jwtSecret)});
};