import configuredAxios from 'helpers/configuredAxios'

const postReportService = (payload) => {
  const axios = configuredAxios('job', 'public')

  return axios.post(`/jobs/${payload.jobId}/report`, {report_reason_id: payload.jobReasonId})
}

export { postReportService }
