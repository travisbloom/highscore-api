var log = require('../logger');

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

exports.returnAuthToken = function(res, accessToken, accessTokenSecret) {
  var response = {
    access_token: accessToken
  };
  if (accessTokenSecret) response.access_token_secret = accessTokenSecret;
  res.json(response);
};