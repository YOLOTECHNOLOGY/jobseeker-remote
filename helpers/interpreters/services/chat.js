import configuredAxios from '../../configuredAxios'

export const getAuth = userId => {
    const axios = configuredAxios('jobApplication', 'protected')
    return axios.get(`/chats/jobseekers/im-auth-code?auid=${userId}&ver=1`)
}
export const list = params => {
    const axios = configuredAxios('jobApplication', 'protected')
    return axios.get(`/chats/jobseekers?page=1&size=110`, { params })
}
export const createChat = (jobId, params) => {
    const axios = configuredAxios('jobApplication', 'protected')
    return axios.post(`/jobs/${jobId}/jobseekers/chat`, params)
}
export const check = jobId => {
    const axios = configuredAxios('jobApplication', 'protected')
    return axios.get(`/chats/check-exists/${jobId}/jobseekers`)
}