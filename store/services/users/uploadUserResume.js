import configuredAxios from 'helpers/configuredAxios'

const uploadUserResumeService = (resume) => {
  const axios = configuredAxios('jobseeker', 'protected')
  const URL = '/upload-resume'
  const headers = {
    'Content-Type': 'multipart/form-data'
  }

  const formData = new FormData({
    'file': resume,
    'filename': resume.name
  })

  return axios.post(URL, formData, { headers })
}

export { uploadUserResumeService }
