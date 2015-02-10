#!/usr/bin/env node
//node modules
var http = require('http');
//app modules
var app = require('./app/app');
var log = require('./app/logger');
var config = require('./config');

var port = config.envVariables[config.appEnv].port;
app.set('port', port);

var server = http.createServer(app);

/**
 * Listen on provided port
 */

server.listen(port);
server.on('error', function(err) {
  log.error('error booting up server', err)
});
server.on('listening', function(){
  log.info('Listening on port ' + port);
});