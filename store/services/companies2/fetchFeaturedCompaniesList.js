import configuredAxios from 'helpers/configuredAxios'
import queryString from 'query-string'

const fetchFeaturedCompaniesListService = (payload) => {
  const axios = configuredAxios('company', 'public')
  return axios.get(`/featured-companies?${queryString.stringify(payload)}`)
}

export { fetchFeaturedCompaniesListService }
