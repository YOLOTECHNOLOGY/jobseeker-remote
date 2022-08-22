import configuredAxios from 'helpers/configuredAxios'

const oldFetchConfigService = () => {
  const axios = configuredAxios('data', 'public')

  return axios.get('/config?country_code=ph')
}

export { oldFetchConfigService }