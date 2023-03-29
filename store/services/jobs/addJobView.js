import configuredAxios from 'helpers/configuredAxios'

const addJobViewService = (payload) => {
  const axios = configuredAxios('job', payload.status, false, payload.serverAccessToken)
  return axios.post(`/${payload.jobId}/view`, {
    function_job_title_id: payload.function_job_title_id,
    source: payload.source,
    device: payload.device
  })
}

export { addJobViewService }