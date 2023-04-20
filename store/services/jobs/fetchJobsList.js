import queryString from 'query-string'
import configuredAxios from 'helpers/configuredAxios'

const fetchJobsListService = (payload, accessToken = null) => {
  const endpointType = accessToken ? 'protected' : 'public'

  const axios = configuredAxios('job', endpointType, false, accessToken)
  // TODO 不应该这一写，暂时做一下简单处理之后会改
  if (!payload.is_company_verified) {
    payload.is_company_verified = null
  }
  return axios.get(`search?${queryString.stringify(payload)}`)
}

export { fetchJobsListService }
