const path = require('path')
const redirectionPaths = require('./lib/redirection')
const generateRobotsTxt = require('./scripts/generateRobotsTxt.js')

module.exports = {
  async redirects() {
    if (process.env.MAINTENANCE === 'true') {
      return [
        {
          source: '/((?!maintenance).*)',
          destination: '/maintenance',
          permanent: false
        }
      ]
    }

    return redirectionPaths
  },
  reactStrictMode: true,
  env: {
    ENV: process.env.ENV,
    MAINTENANCE: process.env.MAINTENANCE,
    HOST_PATH: process.env.HOST_PATH,
    API_BASEPATH: process.env.API_BASEPATH,
    S3_BUCKET_URL: process.env.S3_BUCKET_URL,
    DATA_BOSSJOB_URL: process.env.DATA_BOSSJOB_URL,
    DATA_BOSSHUNT_URL: process.env.DATA_BOSSHUNT_URL,
    AUTH_BOSSJOB_URL: process.env.AUTH_BOSSJOB_URL,
    JOB_BOSSJOB_URL: process.env.JOB_BOSSJOB_URL,
    SEARCH_BOSSJOB_URL: process.env.SEARCH_BOSSJOB_URL,
    CHAT_BOSSJOB_URL: process.env.CHAT_BOSSJOB_URL,
    JOBSEEKER_URL: process.env.JOBSEEKER_URL,
    DOCUMENT_GENERATOR_URL: process.env.DOCUMENT_GENERATOR_URL,
    RECO_URL: process.env.RECO_URL,
    PAYMENT_URL: process.env.PAYMENT_URL,
    ACADEMY_URL: process.env.ACADEMY_URL,
    ACADEMY_CLIENT_URL: process.env.ACADEMY_CLIENT_URL,
    VCF_CLIENT_URL: process.env.VCF_CLIENT_URL,
    COMPANY_URL: process.env.COMPANY_URL,
    CONFIG_URL: process.env.CONFIG_URL,
    GA_TRACKING_ID: process.env.GA_TRACKING_ID,
    OLD_PROJECT_URL: process.env.OLD_PROJECT_URL,
    NEW_PROJECT_URL: process.env.NEW_PROJECT_URL,
    BOSSHUNT_URL: process.env.BOSSHUNT_URL,
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    COUNTRY_KEY: process.env.COUNTRY_KEY,
    LINKEDIN_CLIENT_ID: process.env.LINKEDIN_CLIENT_ID,
    LINKEDIN_CLIENT_SECRET: process.env.LINKEDIN_CLIENT_SECRET,
    APP_STORE_LINK: 'https://apps.apple.com/sg/app/bossjob/id1592073585',
    GOOGLE_PLAY_STORE_LINK: 'https://play.google.com/store/apps/details?id=com.poseidon.bossjobapp'
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'node_modules')]
  },
  images: {
    domains: ['dev-assets.bossjob.com', 'assets.bossjob.com', 'fakeimg.pl']
  },
  webpack(config, { isServer }) {
    if (isServer) {
      generateRobotsTxt()
    }
    return config
  }
}
