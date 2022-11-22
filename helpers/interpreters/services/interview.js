import configuredAxios from '../../configuredAxios'

export const accept = (applicationId, inviteInterviewId) => {
    const axios = configuredAxios('jobApplication', 'protected')
    return axios.put(`/${applicationId}/jobseekers/interviews/${inviteInterviewId}/accept`)
}
export const cancel = (applicationId, inviteInterviewId, params) => {
    const axios = configuredAxios('jobApplication', 'protected')
    return axios.put(`/${applicationId}/jobseekers/interviews/${inviteInterviewId}/cancel`, params)
}
export const decline = (applicationId, inviteInterviewId, params) => {
    const axios = configuredAxios('jobApplication', 'protected')
    return axios.put(`/${applicationId}/jobseekers/interviews/${inviteInterviewId}/decline`, params)
}
export const checkIn = (applicationId, inviteInterviewId) => {
    const axios = configuredAxios('jobApplication', 'protected')
    return axios.put(`/${applicationId}/jobseekers/interviews/${inviteInterviewId}/check-in`)
}
export const reportIssue = (applicationId, inviteInterviewId, params) => {
    const axios = configuredAxios('jobApplication', 'protected')
    return axios.post(`/jobseekers/interviews/${inviteInterviewId}/report`, params)
}
export const attend = (applicationId, inviteInterviewId,params) => {
    const axios = configuredAxios('jobApplication', 'protected')
    return axios.put(`/${applicationId}/jobseekers/interviews/${inviteInterviewId}/mark-attendance`,params)
}
export const askResult = (applicationId, inviteInterviewId) => {
    const axios = configuredAxios('jobApplication', 'protected')
    return axios.put(`/${applicationId}/jobseekers/interviews/${inviteInterviewId}/request-result`)
}