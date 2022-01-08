const path = require('path')
const redirectionPaths = require('./lib/redirection')

module.exports = {
  async redirects() {
    return redirectionPaths
  },
  reactStrictMode: true,
  env: {
    ENV: process.env.ENV,
    HOST_PATH: process.env.HOST_PATH,
    API_BASEPATH: process.env.API_BASEPATH,
    S3_BUCKET_URL: process.env.S3_BUCKET_URL,
    DATA_BOSSJOB_URL: process.env.DATA_BOSSJOB_URL,
    DATA_BOSSHUNT_URL: process.env.DATA_BOSSHUNT_URL,
    AUTH_BOSSJOB_URL: process.env.AUTH_BOSSJOB_URL,
    SEARCH_BOSSJOB_URL: process.env.SEARCH_BOSSJOB_URL,
    CHAT_BOSSJOB_URL: process.env.CHAT_BOSSJOB_URL,
    DOCUMENT_GENERATOR_URL: process.env.DOCUMENT_GENERATOR_URL,
    RECO_URL: process.env.RECO_URL,
    PAYMENT_URL: process.env.PAYMENT_URL,
    GA_TRACKING_ID: process.env.GA_TRACKING_ID,
    OLD_PROJECT_URL: process.env.OLD_PROJECT_URL,
    NEW_PROJECT_URL: process.env.NEW_PROJECT_URL,
    DATA_BOSSJOB_JOB_URL: process.env.DATA_BOSSJOB_JOB_URL,
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    COUNTRY_KEY: process.env.COUNTRY_KEY
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'node_modules')],
  },
  images: {
    domains: ['dev-assets.bossjob.com', 'assets.bossjob.com', 'fakeimg.pl'],
  },
}
  