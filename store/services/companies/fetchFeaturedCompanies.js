import configuredAxios from 'helpers/configuredAxios'

const fetchFeaturedCompaniesService = () => {
  const axios = configuredAxios('data', 'public')
  return axios.get(`/features`)
}

export { fetchFeaturedCompaniesService }
