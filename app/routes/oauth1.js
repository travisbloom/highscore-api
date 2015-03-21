//node modules
var querystring = require('querystring');
//3rd party modules
var router = require('express').Router();
var request = require('request-promise');
//app modules
var log = require('../logger');
var config = require('../../config');
var response = require('../factories/standard-response');

module.exports.buildOAuth = function(access_token, access_token_secret, provider) {
  if (!access_token_secret || !access_token)
    throw 'tokens not present for oAuth1 request';
  return {
    consumer_key: config[provider].consumerKey,
    consumer_secret: config[provider].consumerSecret,
    access_token: access_token,
    access_token_secret: access_token_secret
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
    callback: config.envVariables[config.appEnv].clientUri
  };
  log.debug(provider + ' Oauth1 request token requested');
  //Obtain request token for the authorization popup.
  request({  method: 'POST', url: oAuthClients[provider].requestTokenUrl, oauth: requestTokenOauth})
    .then(function(reqTokenRes) {
      reqTokenRes = querystring.parse(reqTokenRes);
      var params = querystring.stringify({ oauth_token: reqTokenRes.oauth_token });
      //Redirect to the authorization screen.
      res.redirect(oAuthClients[provider].authenticateUrl + '?' + params);
    })
    .catch(function(err) {
      response.error(err, res, provider)
    });
}

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
  log.debug(req.provider + ' Oauth1 access token requested');
  request({ method: 'POST', url: oAuthClients[req.provider].accessTokenUrl, oauth: accessTokenOauth })
    .then(function (accessTokenRes) {
      //return the access token to the user
      response.returnAuthToken(res, querystring.parse(accessTokenRes));
    })
    .catch(function(err){
      response.error(err, res, req.provider)
    });
});

module.exports.router = router;
