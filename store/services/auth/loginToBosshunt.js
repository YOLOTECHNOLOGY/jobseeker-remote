import configuredAxios from 'helpers/configuredAxios'
import queryString from 'query-string'

const loginToBosshuntService = (payload) => {
  const axios = configuredAxios('bosshunt', 'protected')
  return axios.post(`login-with-bossjob`, {...queryString.stringify(payload)})
}

export { loginToBosshuntService }