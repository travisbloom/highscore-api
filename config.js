module.exports = {
  fb: {
    clientSecret: process.env.FB_SECRET || 'CHANGEME'
  },
  appEnv: process.env.APP_ENV || 'local',
  envVariables: {
    local: {
      port: 3000
    },
    dev: {
      port: 80
    }
  }
};