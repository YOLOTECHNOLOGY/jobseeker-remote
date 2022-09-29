import configuredAxios from 'helpers/configuredAxios'

const authenticationSendEmaillOtp = (payload) => {
  const axios = configuredAxios('jobseekerRootUrl', 'protected')
  return Promise.resolve(
    axios.post(`authentication/email-otp/generate`, {
      ...payload,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET
    })
  )
}

const authenticationJobseekersLogin = (payload) => {
  const axios = configuredAxios('jobseekerRootUrl', 'protected')
  return Promise.resolve(
    axios.post(`authentication/jobseekers/login`, {
      ...payload,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET
    })
  )
}

const authenticationSendEmailMagicLink = (payload) => {
  const axios = configuredAxios('jobseekerRootUrl', 'protected')
  return Promise.resolve(
    axios.post(`authentication/jobseekers/email-magic-link/generate`, {
      ...payload,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET
    })
  )
}

export {
  authenticationSendEmaillOtp,
  authenticationJobseekersLogin,
  authenticationSendEmailMagicLink
}
