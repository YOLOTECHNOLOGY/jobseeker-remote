/* eslint-disable import/no-anonymous-default-export */
import configuredAxios from 'helpers/configuredAxios'

import fetchRecruiterSubscriptionFeature from './fetchRecruiterSubscriptionFeature'

export const recruiterDetail = (id) => {
  const axios = configuredAxios('recruiters', 'protected')
  return axios.get(`/${id}/recruiter-info`)
}

export default {
  fetchRecruiterSubscriptionFeature
}

