import configuredAxios from 'helpers/configuredAxios'

const fetchChattedJobs = (payload) => {
  const { page, accessToken = null } = payload || {}
  const endpointType = 'protected'
  const axios = configuredAxios('jobApplication', endpointType, false, accessToken)
  return axios.get(`/chats/jobseekers/chatted-jobs?page=${page}&size=15`)
}

const fetchResume = (payload) => {
  const { page, accessToken = null } = payload || {}
  const endpointType = 'protected'
  const axios = configuredAxios('jobApplication', endpointType, false, accessToken)
  return axios.get(`/jobseekers/resume-exchanged-jobs?page=${page}&size=15`)
}

const fetchResumeContact = (payload) => {
  const { page, accessToken = null } = payload || {}
  const endpointType = 'protected'
  const axios = configuredAxios('jobApplication', endpointType, false, accessToken)
  return axios.get(`/jobseekers/contact-exchanged-jobs`)
}

const fetchSaved = (payload) => {
  const { page, accessToken = null } = payload || {}
  const endpointType = 'protected'
  const axios = configuredAxios('job', endpointType, false, accessToken)
  return axios.get(`/saved-jobs?page=${page}&size=15`)
}

const fetchViewed = (payload) => {
  const { page, accessToken = null } = payload || {}
  const endpointType = 'protected'
  const axios = configuredAxios('job', endpointType, false, accessToken)
  return axios.get(`/viewed-jobs?page=${page}&size=15`)
}

const updateNoticePeriod = (payload) => {
  const { id, accessToken = null } = payload || {}
  const endpointType = 'protected'
  const axios = configuredAxios('jobseeker', endpointType, false, accessToken)
  return axios.patch(`/me`, { notice_period_id: id })
}

const fetchPersonalInfo = (payload) => {
  const { accessToken = null } = payload || {}
  const endpointType = 'protected'
  const axios = configuredAxios('jobseeker', endpointType, false, accessToken, true)
  return axios.get(`/personal-info?interview_filter=all`)
}

const fetchRecruiters = (payload) => {
  const { accessToken = null } = payload || {}
  const endpointType = 'protected'
  const axios = configuredAxios('recruiters', endpointType, false, accessToken)
  return axios.get(`/saved-me-recruiters?page=1&size=6`)
}

const fetchViewedRcruiters = (payload) => {
  const { accessToken = null } = payload || {}
  const endpointType = 'protected'
  const axios = configuredAxios('recruiters', endpointType, false, accessToken)
  return axios.get(`/viewed-me-recruiters?page=1&size=6`)
}

const fetchInterviews = (payload) => {
  const { page, accessToken = null } = payload || {}
  const endpointType = 'protected'
  const axios = configuredAxios('jobApplication', endpointType, false, accessToken)
  return axios.get(`jobseekers/interviews?page=${page}&size=15`)
}

const fetchResumes = (payload) => {
  const { accessToken = null } = payload || {}
  const endpointType = 'protected'
  const axios = configuredAxios('jobseeker', endpointType, false, accessToken, true)
  return axios.get(`/resumes`)
}

const fetchDeleteResumes = (payload) => {
  const { accessToken = null, id } = payload || {}
  const endpointType = 'protected'
  const axios = configuredAxios('jobseeker', endpointType, false, accessToken)
  return axios.delete(`/resumes/${id}/delete`)
}

const fetchRenameResumes = (payload) => {
  const { accessToken = null, id } = payload || {}
  const endpointType = 'protected'
  const axios = configuredAxios('jobseeker', endpointType, false, accessToken)
  const data = {
    filename: payload.filename
  }
  return axios.put(`/resumes/${id}/rename`, data)
}

const fetchSendResumeEmail = (payload) => {
  const { accessToken = null, id } = payload || {}
  const endpointType = 'protected'
  const axios = configuredAxios('jobseeker', endpointType, false, accessToken)
  const data = {
    email: payload.email,
    resume_id: id
  }
  return axios.post(`/send-resume-email`, data)
}

const fetchCheckChats = (payload) => {
  const { accessToken = null, ids } = payload || {}
  const endpointType = 'protected'
  const axios = configuredAxios('jobApplication', endpointType, false, accessToken)
  return axios.get(`chats/check-exists/jobseekers?recruiter_ids=${ids}`)
}

export {
  fetchChattedJobs,
  fetchSaved,
  fetchResume,
  fetchResumeContact,
  fetchViewed,
  updateNoticePeriod,
  fetchPersonalInfo,
  fetchRecruiters,
  fetchViewedRcruiters,
  fetchInterviews,
  fetchResumes,
  fetchDeleteResumes,
  fetchCheckChats,
  fetchRenameResumes,
  fetchSendResumeEmail
}
