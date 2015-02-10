//node modules
var querystring = require('querystring');
//3rd party modules
var router = require('express').Router();
var request = require('request-promise');
//app modules
var log = require('../logger');
var config = require('../../config');
var response = require('../factories/standard-response');

/**
 * OAuth Client info
 * */
var oAuthClients = {
  facebook: {
    accessTokenUrl: 'https://graph.facebook.com/v2.2/oauth/access_token'
  }
};
/**
 * determine what provider the oAuth request is for
 * */
router.param('provider', function (req, res, next, provider) {
  req.provider = provider;
  next();
});
/**
 * Generate initial request to oAuth1 provider, redirect to authorize page once oauth_token is passed back
 * */
router.post('/:provider', function (req, res) {
  var body;
  //add client secret to the request
  if (!req.body || !req.body.code || !req.body.clientId || !req.body.redirectUri)
    return response.error(req.provider + ' auth fields not passed', res);
  //reformat json body, add client_secret
  body = {
    client_id: req.body.clientId,
    redirect_uri: req.body.redirectUri,
    code: req.body.code,
    client_secret: config[req.provider].clientSecret
  };
  //submit POST to facebook
  request({ method: 'POST', uri: oAuthClients[req.provider].accessTokenUrl, json: body })
    .then(function(returnedData) {
      //convert returned query params to json
      //returns access_token and expires
      response.returnAuthToken(res, querystring.parse(returnedData));
    })
    .catch(function(err) {
      response.error(err, res, req.provider);
    });
});

module.exports = router;
