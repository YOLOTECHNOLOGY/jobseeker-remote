import configuredAxios from 'helpers/configuredAxios'

const emailNotificationSettingUpdate = (payload) => {
  const axios = configuredAxios('jobseeker', 'protected')
  return Promise.resolve(
    axios.patch(`/email-notification-setting/update`, {
      ...payload
    })
  )
}

export { emailNotificationSettingUpdate }
