import configuredAxios from 'helpers/configuredAxios'

const postReportService = (payload) => {
  const axios = configuredAxios('job', 'protected', '', payload.accessToken)

  return axios.post(`/jobs/${payload.reportJobData.jobId}/report`, {report_reason_id: payload.reportJobData.jobReasonId})
}

export { postReportService }
