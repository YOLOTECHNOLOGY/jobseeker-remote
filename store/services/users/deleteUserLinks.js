import configuredAxios from 'helpers/configuredAxios'

const deleteUserLinkService = (payload) => {
  const axios = configuredAxios('jobseeker', 'protected', '', payload.accessToken)

  return axios.delete(`/websites/${payload.linkId}/delete`)
}

export { deleteUserLinkService }