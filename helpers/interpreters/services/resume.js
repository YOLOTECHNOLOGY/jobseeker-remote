import configuredAxios from '../../configuredAxios'

export const sendResume = (applicationId, requestResumeId, params) => {

    const axios = configuredAxios('jobApplication', 'protected')
    return axios.put(
        `/${applicationId}/jobseekers/resume-requests/${requestResumeId}/complete`,
        params
    )
}

export const askSendResume = (applicationId, requestResumeId, params) => {

    const axios = configuredAxios('jobApplication', 'protected')
    return axios.put(
        `/${applicationId}/jobseekers/resume-requests/${requestResumeId}/create`,
        params
    )
}

export const decline = (applicationId, requestResumeId) => {

    const axios = configuredAxios('jobApplication', 'protected')
    return axios.put(`/${applicationId}/jobseekers/resume-requests/${requestResumeId}/decline`)
}

export const getList = () => {
    const axios = configuredAxios('jobseeker', 'protected')
    return axios.get(`/resumes`)
}