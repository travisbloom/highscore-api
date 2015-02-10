//node modules
var path = require('path');
//3rd party modules
var S3StreamLogger = require('s3-streamlogger').S3StreamLogger;
var winston = require('winston');
//app modules
var config = require('../config');

var logDir = path.join(process.cwd(), 'log');

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      level: 'info',
      colorize: true
    })
  ]
});
/**
 * send log files to log dir
 * */
if (config.appEnv === 'local') {
  logger.add(winston.transports.File, {
    name: 'localFile',
    level: config.debugMode ? 'debug' : 'info',
    filename: logDir + '/error.log'
  });
}

/**
 * upload log files to s3 bucket
* */
if (config.appEnv !== 'local') {
  var s3_stream = new S3StreamLogger({
    bucket: config.envVariables[config.appEnv].s3Bucket + '/logs/' + config.appEnv,
    access_key_id: config.aws.clientKey,
    secret_access_key: config.aws.clientSecret,
    upload_every: 100,
      name_format: '%Y-%m-%d-%H-%M-' + config.appEnv + '-' + process.env.HOSTNAME + '.log'
  });
  logger.add(winston.transports.File, {
    name: 's3Logs',
    level: 'warn',
    handleExceptions: true,
    stream: s3_stream
  });
}

module.exports = logger;