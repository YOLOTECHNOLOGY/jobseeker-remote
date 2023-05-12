import configuredAxios from '../../configuredAxios'

export const jobDetail = jobId => {
    const axios = configuredAxios('job', 'protected')
    return axios.get(`/${jobId}`)
}
