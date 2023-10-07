import configuredAxios from 'helpers/configuredAxios'

const fetchFeaturedRemoteCompanies = (payload = {}) => {
  const axios = configuredAxios('company', 'protected')
  const { page = 1, size = 15 } = payload
  return axios.get(`/featured-remote-companies?page=${page}&size=${size}`)
}

export { fetchFeaturedRemoteCompanies }
