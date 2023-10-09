import configuredAxios from 'helpers/configuredAxios'
import queryString from 'query-string'
const fetchFeaturedRemoteCompanies = (payload = {}) => {
  const axios = configuredAxios('company', 'protected')
  return axios.get(`/featured-remote-companies?${queryString.stringify(payload)}`)
}

const fetchSearchRemoteService = (payload, token = '') => {
  const axios = configuredAxios('company', token ? 'protected' : 'public')
  return axios.get(`/search-remote?${queryString.stringify(payload)}`)
}
const fetchSearchSuggestionRemoteService = (payload, token = '') => {
  const axios = configuredAxios('company', token ? 'protected' : 'public')
  return axios.get(`/search-remote-suggestion?${queryString.stringify(payload)}`)
}

export { fetchFeaturedRemoteCompanies, fetchSearchRemoteService, fetchSearchSuggestionRemoteService }
