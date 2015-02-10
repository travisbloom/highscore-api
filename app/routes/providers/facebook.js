var url = require('url');
var querystring = require('querystring');
var express = require('express');
var request = require('request-promise');
var config = require('../../../config');
var response = require('../../factories/standard-response');
var router = express.Router();
var fbUri = 'https://graph.facebook.com/v2.2';
var log = require('../../logger');

function generateUrl(path, queryParams) {
  var newUrl =  url.parse(fbUri + path);
  newUrl.query.access_token = token;
  return url.format(newUrl);
}
/* GET home page. */
router.post('/auth', function(req, res, next) {
  var body;
  //add client secret to the request
  if (!req.body || !req.body.code || !req.body.clientId || !req.body.redirectUri)
    return response.error('fb auth fields not passed', res, 'facebook');
  //reformat json body, add client_secret
  body = {
    client_id: req.body.clientId,
    redirect_uri: req.body.redirectUri,
    code: req.body.code,
    client_secret: config.facebook.clientSecret
  };
  //submit POST to facebook
  request({ method: 'POST', uri: fbUri + '/oauth/access_token', json: body })
    .then(function(returnedData) {
      log.debug('facebook auth returned with user data');
      //convert returned query params to json
      //returns access_token and expires
      response.returnAuthToken(res, querystring.parse(returnedData));
    })
    .catch(function(err) {
      response.error(err, res, 'facebook');
    });
});

router.use(function(req, res, next) {
  if (!req.auth)
    return response.error('fb auth tokens not passed to request', res);
  next();
});
router.get('/pictures/likes', likesRequest);
router.get('/status/likes', likesRequest);
function likesRequest(req, res) {
  var fbReq;
  if (req.originalUrl.indexOf('pictures') !== -1) {
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
  console.log(fbReq.query)
  if (req.query.since) {
    fbReq.query.since = req.query.since;
  } else {
    log.info('initial custom score request submitted for %s', req.path);
  }
  fbReq = url.format(fbReq);
  log.debug('facebook like request submitted');
  return request(fbReq)
    //todo pipe compute to lambda
    .then(function(providerRes) {
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
      log.debug('returned');
      //convert returned query params to json
      response.returnScore(res, {
        score: currentScore,
        metaData: {
          queryParams: {
            //tracks the last id queried by facebook, reduces redundant query results from returning
            //e.g. prevents previously calculated photos from being queried
            since: Math.round(+new Date() / 1000),
            //tracks the current max, will override returned max if since is present
            currentScore: currentScore,
            currentItemId: currentItemId
          }
        }
      })
    })
    .catch(function(err) {
      response.error(err, res, 'facebook');
    });
  ;
}
module.exports = router;
