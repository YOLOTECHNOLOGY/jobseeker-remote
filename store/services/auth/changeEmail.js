import configuredAxios from 'helpers/configuredAxios'

const sendEmaillOtp = (payload) => {
  const axios = configuredAxios('auth', 'protected')
  return Promise.resolve(
    axios.post(`/email/otp`, {
      ...payload,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET
    })
  )
}

const changeEmail = (payload) => {
  const axios = configuredAxios('auth', 'protected')
  return Promise.resolve(
    axios.post(`/change-email`, {
      ...payload,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET
    })
  )
}

const verifyEmail = (payload) => {
  const axios = configuredAxios('auth', 'protected')
  return Promise.resolve(
    axios.post(`/verify-email`, {
      ...payload,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET
    })
  )
}

const sendPhoneNumberOTP = (payload) => {
  const axios = configuredAxios('auth', 'protected')
  return Promise.resolve(
    axios.post(`/phone-number/otp`, {
      ...payload,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET
    })
  )
}

const verifyPhoneNumber = (payload) => {
  const axios = configuredAxios('auth', 'protected')
  return Promise.resolve(
    axios.post(`/verify-phone-number`, {
      ...payload
      // client_id: process.env.CLIENT_ID,
      // client_secret: process.env.CLIENT_SECRET
    })
  )
}

const changePhoneNumber = (payload) => {
  const axios = configuredAxios('auth', 'protected')
  return Promise.resolve(
    axios.post(`/change-phone-number`, {
      ...payload,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET
    })
  )
}

const changePassword = (payload) => {
  const axios = configuredAxios('auth', 'protected')
  return Promise.resolve(
    axios.post(`/change-password`, {
      ...payload,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET
    })
  )
}

const emailNotificationUpdate = (payload) => {
  const axios = configuredAxios('jobseeker', 'protected')
  return Promise.resolve(
    axios.patch(`/email-notification-setting/update`, {
      ...payload
    })
  )
}

const accountSetting = (payload) => {
  const axios = configuredAxios('jobseeker', 'protected', '', payload.accessToken)
  return Promise.resolve(axios.get(`/account-setting`))
}

const facebookMsgDeactivate = () => {
  const axios = configuredAxios('jobseeker', 'protected')
  return Promise.resolve(
    axios.post(`/facebook/messenger/deactivate`, {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET
    })
  )
}

export {
  sendEmaillOtp,
  changeEmail,
  verifyEmail,
  sendPhoneNumberOTP,
  verifyPhoneNumber,
  changePhoneNumber,
  changePassword,
  emailNotificationUpdate,
  accountSetting,
  facebookMsgDeactivate
}
