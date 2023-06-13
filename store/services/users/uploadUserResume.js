import configuredAxios from 'helpers/configuredAxios'

const uploadUserResumeService = (resume) => {
  const axios = configuredAxios('jobseeker', 'protected')
  const URL = '/upload-resume'
  const headers = {
    'Content-Type': 'multipart/form-data'
  }

  const formData = new FormData()
  formData.append('file', resume)
  formData.append('filename', resume.name)
  formData.append('parse_resume', true)

  return axios.post(URL, formData, { headers })
}

const uploadUserResumeServiceNew = ({resume,id}) => {
  const axios = configuredAxios('resumes', 'protected')
  const URL = `/${id}/update`
  const headers = {
    'Content-Type': 'multipart/form-data'
  }
  console.log(resume,789)
  const formData = new FormData()
  formData.append('file', resume)
  formData.append('filename', resume.name)
  return axios.put(URL, formData, { headers })
}


export { uploadUserResumeService,uploadUserResumeServiceNew }
