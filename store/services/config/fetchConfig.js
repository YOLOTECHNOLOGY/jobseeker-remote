import configuredAxios from 'helpers/configuredAxios'

const fetchConfigService = () => {
  const axios = configuredAxios('config', 'public')
  
  return axios.get(`/list`)
}

export { fetchConfigService }
