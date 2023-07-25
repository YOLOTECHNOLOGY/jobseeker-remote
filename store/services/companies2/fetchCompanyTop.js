import { memoizeWithTime } from 'helpers/cache'
import configuredAxios from 'helpers/configuredAxios'

const fetchCompanyTopService = memoizeWithTime((location_id) => {
  const axios = configuredAxios('company', 'public')
  return axios.get(`/featured-companies?page=1&size=6&job_location_ids=${location_id}`)
},
  location_id => location_id,
  3600
)

export { fetchCompanyTopService }
