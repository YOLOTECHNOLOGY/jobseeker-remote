import configuredAxios from 'helpers/configuredAxios'

const updateUserVisibilityToWorkService = (payload) => {
    const axios = configuredAxios('data', 'protected')
    return axios.post('/users/visibility', payload)
}

export { updateUserVisibilityToWorkService }
