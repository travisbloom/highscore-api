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
  try {
    var oauth = buildOAuth(req.auth, 'twitter');
    //if auth credentials are missing from the request
  } catch(err) {
   return response.error(err, res)
  }
  request({uri: providerUri + '/statuses/user_timeline', oauth: oauth}).then(function(reqRes) {
    console.log('success', reqRes);
  }).catch(function(reqRes){
    response.error(err, res, 'twitter')
  });
});


module.exports = router;
