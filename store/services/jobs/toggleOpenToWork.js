import configuredAxios from 'helpers/configuredAxios'

const toggleOpenToWorkService = (payload) => {
    const axios = configuredAxios('data', 'protected')
    return axios.post('/users/visibility', payload)
}

export { toggleOpenToWorkService }
