import configuredAxios from '../../configuredAxios'

export const sendResume = (applicationId, requestResumeId, params) => {

    const axios = configuredAxios('jobApplication', 'protected')
    return axios.put(
        `/${applicationId}/jobseekers/resume-requests/${requestResumeId}/complete`,
        params
    )
}