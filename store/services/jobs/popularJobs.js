import { cache } from 'react'
import configuredAxios from 'helpers/configuredAxios'

const fetchPopularJobs = cache((params) => {
  const axios = configuredAxios('job', 'protected')
  return axios.get(`/popular-jobs`, { params })
})

export { fetchPopularJobs }
