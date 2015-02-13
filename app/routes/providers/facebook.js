//node modules
var url = require('url');
var querystring = require('querystring');
//3rd party modules
var router = require('express').Router();
var request = require('request-promise');
//app modules
var log = require('../../logger');
var config = require('../../../config');
var response = require('../../factories/standard-response');

var fbUri = 'https://graph.facebook.com/v2.2';

router.get('/pictures/likes', likesRequest);
router.get('/status/likes', likesRequest);
function likesRequest(req, res) {
  var fbReq;
  //build URL for request
  if (req.path.indexOf('pictures') !== -1) {
    fbReq = '/me/photos/uploaded';
  } else {
    fbReq = '/me/feed';
  }
  fbReq = url.parse(fbUri + fbReq);
  fbReq.query = {
    access_token: req.auth.access_token,
    limit: 3000,
    fields: 'likes.limit(1).summary(true)'
  };
  if (req.query.since)
    fbReq.query.since = req.query.since;
  fbReq = url.format(fbReq);
  log.debug('facebook like request submitted');
  request(fbReq)
    //todo pipe compute to lambda
    .then(function(providerRes) {
      log.debug('facebook like request returned from api');
      var currentScore = 0, currentItemId = null;
      log.debug('facebook like request returned');
      providerRes = JSON.parse(providerRes);
      //iterate over all the returned items
      providerRes.data.forEach(function (item) {
        if (!item.likes || !item.likes.summary) return;
        var likeScore = +item.likes.summary.total_count;
        //if totalLikes exceeds the previous max
        if (likeScore > currentScore) {
          currentScore = likeScore;
          currentItemId = item.id;
        }
      });
      //if previously queried data is still the highest
      if (req.query.since && req.query.currentScore > currentScore) {
        currentScore = req.query.currentScore;
        currentItemId = req.query.currentItemId;
      }
      //convert returned query params to json
      response.returnScore(res, currentScore, {
        queryParams: {
          //tracks the last id queried by facebook, reduces redundant query results from returning
          //e.g. prevents previously calculated photos from being queried
          since: Math.round(+new Date() / 1000),
          //tracks the current max, will override returned max if since is present
          currentScore: currentScore,
          currentItemId: currentItemId
        }
      });
    })
    .catch(function(err) {
      response.error(err, res, 'facebook', err.error && err.error.code === '190');
    });
}
module.exports = router;
