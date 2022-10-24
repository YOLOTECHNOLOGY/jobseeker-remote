import configuredAxios from '../../configuredAxios'

export const getAuth = userId => {
    const axios = configuredAxios('jobApplication', 'protected')
    return axios.get(`/chats/jobseekers/im-auth-code?auid=${userId}&ver=1`)
}
export const list = () => {
    const axios = configuredAxios('jobApplication', 'protected')
    return axios.get(`/chats/jobseekers?page=1&size=55`)
}
export const createChat = jobId => {
    const axios = configuredAxios('jobApplication', 'protected')
    return axios.post(`/jobs/${jobId}/jobseekers/chat`)
}
export const check = jobId => {
    const axios = configuredAxios('jobApplication', 'protected')
    return axios.get(`/chats/check-exists/${jobId}/jobseekers`)
}