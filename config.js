module.exports = {
  jwtSecret: process.env.HIGHSCORE_JWT_SECRET || 'CHANGEME',
  facebook: {
    clientSecret: process.env.HIGHSCORE_FB_SECRET || 'CHANGEME'
  },
  twitter: {
    consumerKey: process.env.HIGHSCORE_TWITTER_KEY || 'CHANGEME',
    consumerSecret: process.env.HIGHSCORE_TWITTER_SECRET || 'CHANGEME'
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
      applicationUri: 'http://localhost:3000',
      clientUri: 'http://localhost:8100'
    },
    dev: {
      port: 80,
      s3Bucket: 'highscore-data',
      applicationUri: 'dev.api.highscor.com',
      clientUri: 'http://localhost'
    }
  }
};