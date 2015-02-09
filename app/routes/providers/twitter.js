var express = require('express');
var request = require('request-promise');
var config = require('../../../config');
var response = require('../../factories/standard-response');
var router = express.Router();
var buildOAuth =  require('./../oauth1').buildOAuth;
var providerUri = 'https://api.twitter.com/1.1';
var log = require('../../logger');


/**
 * get twitter followers
*/
router.get('/followers/count', function(req, res) {
  var oauth = buildOAuth(req.auth, 'twitter');
  //if auth credentials are missing from the request
  if (oauth.error) return response.error(res, oauth);
  request({uri: providerUri + '/statuses/user_timeline', oauth: oauth}).then(function(reqRes) {
    console.log('success', reqRes);
  }).catch(function(reqRes) {
    console.log('error', reqRes.error)
  });
});


module.exports = router;
