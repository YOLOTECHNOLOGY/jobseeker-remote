import configuredAxios from 'helpers/configuredAxios'
import queryString from 'query-string'

const fetchCompanyFilterService = (payload) => {
  const axios = configuredAxios('company', 'public')
  return axios.get(`/filter?${queryString.stringify(payload)}`)
}

export { fetchCompanyFilterService }
