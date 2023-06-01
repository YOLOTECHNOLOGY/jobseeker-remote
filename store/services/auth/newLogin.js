import configuredAxios from 'helpers/configuredAxios'

const phoneOtpenerate = (payload) => {
  const axios = configuredAxios('auth', 'public')
  return axios.post(`/phone-otp/generate`, payload)
}

const verificationOtp = (payload) => {
  const axios = configuredAxios('auth', 'public')
  return axios.post(`/verification-otp`, payload)
}

const bindUserEmail = (payload) => {
  const axios = configuredAxios('auth', 'public')
  return axios.post(`/bing/user-email`, payload)
}


export { phoneOtpenerate,verificationOtp,bindUserEmail }
