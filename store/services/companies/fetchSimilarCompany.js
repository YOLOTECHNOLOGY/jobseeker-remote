import configuredAxios from 'helpers/configuredAxios'
import queryString from 'query-string'

const fetchSimilarCompanyService = (payload) => {
  const axios = configuredAxios('company', 'public')
  return axios.get(`/${payload.companyId}/similar-companies?${queryString.stringify(payload.query)}`)
}

export { fetchSimilarCompanyService }
