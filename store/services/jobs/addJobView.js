import configuredAxios from 'helpers/configuredAxios'

const addJobViewService = (payload) => {
  const axios = configuredAxios('job', payload.status, false, payload.serverAccessToken)
  return axios.post(`/${payload.jobId}/view`, {
    job_title_id: payload.jobId,
    source: payload.source,
    device: payload.device
  })
}

const getShreCard = (id) => {
  const axios = configuredAxios('job', 'public', false, '')
  return axios.get(`/manage-jobs/shared-jobs/${id}`)
}


export { addJobViewService, getShreCard }