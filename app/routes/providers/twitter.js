var express = require('express');
var request = require('request-promise');
var config = require('../../../config');
var response = require('../../factories/standard-response');
var router = express.Router();
var twitterOAuthClient =  require('./../oauth1').clients.twitter;
var providerUri = 'https://api.twitter.com/1.1';
var log = require('../../logger');

/**
 * get twitter followers
*/
router.get('/followers/count', function(req, res) {
  if (!req.query.access_token || !req.query.access_token_secret)
    response.error(res, {
      internalMessage: 'oAuth1 tokens missing from params',
      userMessage: 'There was an error submitting your request, please try again later',
      data: {passedParams: req.query}
    });
  twitterOAuthClient.get(providerUri + '/statuses/retweeted_by_me.json', req.query.access_token, req.query.access_token_secret, function(err, data) {
    console.log(err, data);
  });
});


module.exports = router;
