import configuredAxios from '../../configuredAxios'

// eslint-disable-next-line no-undef
export const confirm = (applicationId,confirmLocationId) => {
  const axios = configuredAxios('jobApplication', 'protected')
  return axios.get(`/${applicationId}/jobseekers/working-locations/${confirmLocationId}/confirm`)
}
