import configuredAxios from 'helpers/configuredAxios'

export const fetchSwitchJobService = (payload) => {
  const axios = configuredAxios('jobApplication', payload.status, false, payload.serverAccessToken)
  return axios.put(`/${payload.applicationId}/jobseekers/switch-job`, { job_id: payload.job_id, source: 'web', device: 'web' })
}
