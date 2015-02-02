module.exports = {
  fb: {
    clientSecret: process.env.HIGHSCORE_FB_SECRET || 'CHANGEME'
  },
  aws: {
    clientKey: process.env.HIGHSCORE_AWS_CLIENT || 'CHANGEME',
    clientSecret: process.env.HIGHSCORE_AWS_SECRET || 'CHANGEME'
  },
  debugMode: false,
  appEnv: process.env.HIGHSCORE_ENV || 'local',
  envVariables: {
    local: {
      port: 3000,
      s3Bucket: 'highscore-data'
    },
    dev: {
      port: 80,
      s3Bucket: 'highscore-data'
    }
  }
};