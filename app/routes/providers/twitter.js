//node modules
//3rd party modules
var router = require('express').Router();
var request = require('request-promise');
//app modules
var log = require('../../logger');
var config = require('../../../config');
var response = require('../../factories/standard-response');
var buildOAuth =  require('./../oauth1').buildOAuth;

var providerUri = 'https://api.twitter.com/1.1';
/**
 * get twitter followers
*/
router.post('/followers/count', function(req, res) {
  try {
    var oauth = buildOAuth(req.auth.oauth_token, req.auth.oauth_token_secret, 'twitter');
  } catch(err) {
    //if auth credentials are missing from the request
    return response.error(err, res)
  }
  request({uri: providerUri + '/account/verify_credentials.json', oauth: oauth, json:true}).then(function(providerRes) {
    response.returnScore(res, providerRes.followers_count);
  }).catch(function(err){
    response.error(err, res, 'twitter')
  });
});


module.exports = router;
