import configuredAxios from '../../configuredAxios'

export const create = (applicationId, id, params) => {

    const axios = configuredAxios('jobApplication', 'protected')
    return axios.put(
        `/${applicationId}/jobseekers/not-interest/${id}/create`, params
    )
}
