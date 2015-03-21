var log = require('../logger');
var jwt = require('jwt-simple');
var config = require('../../config');


function logError(err, provider) {
  if (typeof err === 'string') return log.warn(err);
  //provider returned errors
  if (err.message && typeof provider === 'string')
    return log.warn('Error returned by ' + provider + ': ', err.message, err.error, 'Status Code: ' + err.statusCode);
  log.error('uncaught error passed to error responder', err);
}

exports.error = function(serverErr, res, returnedErr, expiredToken) {
  logError(serverErr, returnedErr);
  returnedErr = returnedErr || {};
  //if a provider is passed as the returned error
  if (typeof returnedErr === 'string')
    returnedErr.userMessage = 'There was an error communicating with ' + returnedErr + '. Please try again later';
  if (expiredToken)
    returnedErr.expiredToken = true;
  if (config.appEnv !== 'prod')
    returnedErr.serverErr =  serverErr;
  returnedErr.userMessage = returnedErr.userMessage || 'There was an error with your request, please try again later';
  res.status(returnedErr.status || 500).json(returnedErr);
};

exports.returnScore = function(res, score, metaData) {
  metaData = metaData || {};
  metaData.reqTimestamp = new Date().toJSON();
    res.json({
    score: score,
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