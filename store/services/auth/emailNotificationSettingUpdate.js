import configuredAxios from 'helpers/configuredAxios'

const emailNotificationSettingUpdate = (payload) => {
  const axios = configuredAxios('jobseeker', 'protected')
  return Promise.resolve(
    axios.patch(`/email-notification-setting/update`, {
      ...payload
    })
  )
}

const smsNotificationSettingUpdate = (payload) => {
  const axios = configuredAxios('jobseeker', 'protected')
  return axios.patch(`/sms-notification-setting/update`, {
    ...payload
  })
}

export { emailNotificationSettingUpdate,smsNotificationSettingUpdate }
