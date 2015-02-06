module.exports = {
  jwtSecret: process.env.HIGHSCORE_JWT_SECRET || 'CHANGEME',
  facebook: {
    clientSecret: process.env.HIGHSCORE_FB_SECRET || 'CHANGEME'
  },
  twitter: {
    consumerKey: process.env.HIGHSCORE_TWITTER_KEY || 'YQCytIZQ57o5HmlN83WVjFjHP',
    consumerSecret: process.env.HIGHSCORE_TWITTER_SECRET || 'LbEI41uSv7TDNXRF8NiUcfH9gO6YUm3i73uBZfsumWTZvUMPUU'
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
      applicationUri: 'http://localhost:3000'
    },
    dev: {
      port: 80,
      s3Bucket: 'highscore-data',
      applicationUri: 'dev.api.highscor.com'
    }
  }
};