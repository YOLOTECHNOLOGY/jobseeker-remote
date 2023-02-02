import configuredAxios from 'helpers/configuredAxios'

const emailOTPChangeEmailGenerate = (payload) => {
  const axios = configuredAxios('auth', 'protected')
  return Promise.resolve(
    axios.post(`/email-otp/change-email/generate`, {
      ...payload,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET
    })
  )
}

export { emailOTPChangeEmailGenerate }
