var express = require('express');
var querystring = require('querystring');
var router = express.Router();
var request = require('request-promise');
var config = require('../../config');
var response = require('../factories/standard-response');
var q = require('q');

module.exports.buildOAuth = function(auth, provider) {
  if (!auth.access_token || !auth.access_token_secret)
    return {
      error: 400,
      internalMessage: 'oAuth1 tokens missing from params',
      userMessage: 'There was an error submitting your request, please try again later',
      data: {passedAuth: auth}
    };
  return {
    consumer_key: config[provider].consumerKey,
    consumer_secret: config[provider].consumerSecret,
    token: auth.access_token,
    token_secret: auth.access_token_secret
  };
};

/**
 * OAuth Client info
* */
var oAuthClients = {
  twitter: {
    requestTokenUrl: 'https://api.twitter.com/oauth/request_token',
    accessTokenUrl: 'https://api.twitter.com/oauth/access_token',
    authenticateUrl: 'https://api.twitter.com/oauth/authenticate'
  }
};

function requestToken(res, provider) {
  var requestTokenOauth = {
    consumer_key: config[provider].consumerKey,
    consumer_secret: config[provider].consumerSecret,
    callback: 'http://localhost:8100'
  };
  //Obtain request token for the authorization popup.
  request.post({ url: oAuthClients[provider].requestTokenUrl, oauth: requestTokenOauth}).then(function(reqTokenRes) {
    reqTokenRes = querystring.parse(reqTokenRes);
    var params = querystring.stringify({ oauth_token: reqTokenRes.oauth_token });
    //Redirect to the authorization screen.
    res.redirect(oAuthClients[provider].authenticateUrl + '?' + params);
  }).catch(function(errRes) {
    console.log(errRes.error);
  });
}
router.param('provider', function (req, res, next, provider) {
  req.provider = provider;
  next();
});
/**
 * Generate initial request to oAuth1 provider, redirect to authorize page once oauth_token is passed back
 * */
router.get('/:provider', function (req, res) {
  var accessTokenOauth;
  //if the oauth token has yet to be validated
  if (!req.query.oauth_token || !req.query.oauth_verifier)
    return requestToken(res, req.provider);
  //otherwise use the passed oauth tokens to get access tokens
  accessTokenOauth = {
    consumer_key: config[req.provider].consumerKey,
    consumer_secret: config[req.provider].consumerSecret,
    token: req.query.oauth_token,
    verifier: req.query.oauth_verifier
  };
  request.post({ url: oAuthClients[req.provider].accessTokenUrl, oauth: accessTokenOauth }).then(function (accessTokenRes) {
    //return the access token to the user
    response.returnAuthToken(res, querystring.parse(accessTokenRes));
  }).catch(function(errRes) {

  });
});

module.exports.router = router;
