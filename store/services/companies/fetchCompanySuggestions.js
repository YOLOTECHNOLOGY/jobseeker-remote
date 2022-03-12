import configuredAxios from 'helpers/configuredAxios'
import queryString from 'query-string'

const fetchCompanySuggestionsService = (payload) => {
  const axios = configuredAxios('company', 'public')
  return axios.get(`/companies/suggested-search?${queryString.stringify(payload)}`)
}

export { fetchCompanySuggestionsService }
