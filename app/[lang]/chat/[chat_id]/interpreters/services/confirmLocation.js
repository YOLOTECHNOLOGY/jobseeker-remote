import configuredAxios from 'helpers/configuredAxios'

// eslint-disable-next-line no-undef
export const confirm = (applicationId,confirmLocationId) => {
  const axios = configuredAxios('jobApplication', 'protected')
  return axios.put(`/${applicationId}/jobseekers/working-locations/${confirmLocationId}/confirm`)
}
// eslint-disable-next-line no-undef
export const decline = (applicationId,confirmLocationId) => {
  const axios = configuredAxios('jobApplication', 'protected')
  return axios.patch(`/${applicationId}/jobseekers/working-locations/${confirmLocationId}/decline`)
}
