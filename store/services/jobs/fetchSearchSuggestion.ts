import configuredAxios from 'helpers/configuredAxios'
import queryString from 'query-string'

/**
 * Fetches job suggestions based on the given payload.
 *
 * @param {Object} payload - The payload containing search parameters.
 * @param {string} [token=''] - The authentication token (default: '').
 * @return {Promise} The promise that resolves to the fetched job suggestions.
 */
const fetchSearchSuggestionService = (payload, token='') => {
  const axios = configuredAxios('job', token ? 'protected' : 'public')
  return axios.get(`/search-suggestion?${queryString.stringify(payload)}`)
}

export { fetchSearchSuggestionService }
