import configuredAxios from 'helpers/configuredAxios'

const fetchCompanyTopService = (location = 'Makati') => {
  const axios = configuredAxios('company', 'public')
  console.log(location,'location')
  return axios.get(`/featured-companies?page=1&size=6&job_location=${location}`)
}

export { fetchCompanyTopService }
