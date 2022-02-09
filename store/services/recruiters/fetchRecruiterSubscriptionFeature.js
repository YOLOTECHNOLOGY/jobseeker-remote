import configuredAxios from 'helpers/configuredAxios'

const fetchRecruiterSubscriptionFeatureService = (accessToken) => {
  const axios = configuredAxios('data', 'protected', null, accessToken)
  return axios.get('/users/subscription_feature')
}

export {
  fetchRecruiterSubscriptionFeatureService
}
