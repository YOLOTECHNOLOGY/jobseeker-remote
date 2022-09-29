import configuredAxios from 'helpers/configuredAxios'

const generateSendEmaillOtp = (payload) => {
  const axios = configuredAxios('jobseekerRootUrl', 'protected')
  return Promise.resolve(
    axios.post(`authentication/email-otp/generate`, {
      ...payload,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET
    })
  )
}

export { generateSendEmaillOtp }
