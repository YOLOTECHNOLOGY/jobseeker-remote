import configuredAxios from 'helpers/configuredAxios'

const updateUserLinkService = (payload) => {
  const axios = configuredAxios('jobseeker', 'protected', '', payload.accessToken)

  return axios.patch(`/websites/${payload.linkId}/update`, {...payload.linkData})
}

export { updateUserLinkService }