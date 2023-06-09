import configuredAxios from 'helpers/configuredAxios'

const phoneOtpenerate = (payload) => {
  const axios = configuredAxios('auth', 'public')
  return axios.post(`/phone-otp/generate`, payload)
}

const verificationOtp = (payload) => {
  const axios = configuredAxios('auth', 'public')
  return axios.post(`/verification-otp`, payload)
}

const verificationPhoneOtp = (payload) => {
  const axios = configuredAxios('auth', 'public')
  return axios.post(`/verification-phone-otp`, payload)
}


const bindUserEmail = (payload) => {
  const axios = configuredAxios('auth', 'protected')
  return axios.post(`/bind/user-email`, payload)
}

const checkBindNumber = (payload) => {
  const axios = configuredAxios('auth', 'protected')
  return axios.post(`check/bind-number`, payload)
}
const getEmailByPhoneNumber = (payload) => {
  const axios = configuredAxios('auth', 'public')
  return axios.post(`/phone-number`,payload)
}
const checkIsEmailUse = (payload) => {
  const axios = configuredAxios('auth', 'protected')
  return axios.post(`/check/is-email-use`,payload)
}

export { 
  phoneOtpenerate,
  verificationOtp,
  bindUserEmail,
  verificationPhoneOtp,
  checkBindNumber,
  getEmailByPhoneNumber,
  checkIsEmailUse
}
