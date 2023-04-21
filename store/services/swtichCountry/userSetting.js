import configuredAxios from 'helpers/configuredAxios'

const fetchUserSetting = (data, token) => {
  const axios = configuredAxios('jobseeker', 'protected', '', token)

  return axios.post('/user-settings', data)
}

export { fetchUserSetting }
