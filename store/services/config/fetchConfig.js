import configuredAxios from 'helpers/configuredAxios'

const fetchConfigService = () => {
  const axios = configuredAxios('data', 'public')
  return axios.get(`/config?country_code=ph`)
}

export { fetchConfigService }
