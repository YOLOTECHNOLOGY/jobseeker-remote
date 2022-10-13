import configuredAxios from 'helpers/configuredAxios'

const smsOTPChangePhoneNumverGenerate = (payload) => {
  const axios = configuredAxios('auth', 'protected')
  return Promise.resolve(
    axios.post(`/sms-otp/change-phone-number/generate`, {
      ...payload,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET
    })
  )
}

export { smsOTPChangePhoneNumverGenerate }
