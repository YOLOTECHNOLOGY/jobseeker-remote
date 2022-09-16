import configuredAxios from 'helpers/configuredAxios'

export default () => {
  const axios = configuredAxios('payment', 'protected')
  return axios.get('/braintree/token')
}
