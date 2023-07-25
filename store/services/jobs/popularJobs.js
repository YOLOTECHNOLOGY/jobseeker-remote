import { memoizeWithTime } from 'helpers/cache'
import configuredAxios from 'helpers/configuredAxios'

const fetchPopularJobs = memoizeWithTime((params) => {
  const axios = configuredAxios('job', 'protected')
  return axios.get(`/popular`, { params })
},
  params => JSON.stringify(params),
  3600
)

export { fetchPopularJobs }
