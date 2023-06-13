import configuredAxios from 'helpers/configuredAxios'

export const create = (applicationId, params) => {

    const axios = configuredAxios('jobApplication', 'protected')
    return axios.put(`/${applicationId}/jobseekers/not-interested`, params)
}
