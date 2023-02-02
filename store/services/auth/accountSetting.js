import configuredAxios from 'helpers/configuredAxios'

const accountSetting = (payload) => {
  const axios = configuredAxios('jobseeker', 'protected', '', payload.accessToken)
  return axios.get(`/account-setting`)
}

export { accountSetting }
