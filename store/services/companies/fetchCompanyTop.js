import configuredAxios from 'helpers/configuredAxios'

const fetchCompanyTopService = (location_id) => {
  const axios = configuredAxios('company', 'public')
  return axios.get(`/featured-companies?page=1&size=6&job_location_ids=${location_id}`)
}

export { fetchCompanyTopService }
