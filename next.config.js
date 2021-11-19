const path = require('path')

module.exports = {
  reactStrictMode: true,
  env: {
    ENV: process.env.ENV,
    HOST_PATH: process.env.HOST_PATH,
    API_BASEPATH: process.env.API_BASEPATH,
    S3_BUCKET_URL: process.env.S3_BUCKET_URL,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'node_modules')],
  }
}
  