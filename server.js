#!/usr/bin/env node

/**
 * Module dependencies.
 */
var app = require('./app/app');
var log = require('./app/logger');
var http = require('http');
var config = require('./config');

/**
 * Get port from environment and store in Express.
 */
var port = config.envVariables[config.appEnv].port;
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', function(err) {
  log.error('error booting up server', error)
});
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  log.info('Listening on ' + bind);
}
