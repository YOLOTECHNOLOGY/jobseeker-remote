import configuredAxios from 'helpers/configuredAxios'

const fetchResumeDelete = (id) => {
  const axios = configuredAxios('jobseeker', 'protected')
  return Promise.resolve(axios.delete(`/resumes/${id}/delete`))
}

export { fetchResumeDelete }
