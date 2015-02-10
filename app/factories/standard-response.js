var log = require('../logger');
var jwt = require('jwt-simple');
var config = require('../../config');


function logError(err) {
  if (typeof err === 'string') return log.warn(err);
  if (err.message) return log.warn(err.message, err);
  else log.error('uncaught error passed to error responder', err);
}

exports.error = function(serverErr, res, returnedErr) {
  logError(serverErr);
  returnedErr = returnedErr || {};
  //if a provider is passed as the returned error
  if (typeof returnedErr === 'string') {
    returnedErr = {userMessage: 'There was an error communicating with ' + returnedErr + '. Please try again later'};
  }
  returnedErr.userMessage = returnedErr.userMessage || 'There was an error with your request, please try again later';
  res.status(returnedErr.status || 500).json(returnedErr);
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
    access_token: authObj.access_token || authObj.oauth_token,
    access_token_secret: authObj.oauth_token_secret,
    expires: authObj.expires
  };
  res.json({
    jwt: jwt.encode(response, config.jwtSecret)
  });
};