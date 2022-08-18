import configuredAxios from 'helpers/configuredAxios'

const addUserLinkService = (payload) => {
  const axios = configuredAxios('jobseeker', 'protected', '', payload.accessToken)

  return axios.post('/websites/create', {...payload.linkData})
}

export { addUserLinkService }