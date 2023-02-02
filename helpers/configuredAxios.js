import axios from 'axios'
import { getCookie, removeCookie } from 'helpers/cookies'
// import accessToken from 'pages/api/handlers/linkedinHandlers/accessToken'
// import { configureStore } from 'store'
// import { logout } from 'shared/helpers/authentication'
import { IMManager } from 'imforbossjob'
const configuredAxios = (baseURL, type = 'public', passToken, serverAccessToken) => {
  // let remoteAddress = ''
  // let isMobile = ''

  if (typeof window !== 'undefined') {
    // const { store } = configureStore(window.__PRELOADED_STATE__, false)
    // remoteAddress = store.getState().Public.utils.setRemoteIp.ip
    // isMobile = store.getState().Public.utils.setUserDevice.userAgent.isMobile
  }

  let url = ''
  let headers = {
    // remoteAddress: remoteAddress,
    // source: isMobile ? 'mobile-web' : 'web',
  }

  switch (baseURL) {
    case 'data':
      url = process.env.DATA_BOSSJOB_URL
      break
    case 'bosshunt':
      url = process.env.DATA_BOSSHUNT_URL
      break
    case 'auth':
      url = process.env.AUTH_BOSSJOB_URL
      break
    case 'job':
      url = process.env.JOB_BOSSJOB_URL
      break
    case 'search':
      url = process.env.SEARCH_BOSSJOB_URL
      break
    case 'chat':
      url = process.env.CHAT_BOSSJOB_URL
      break
    case 'jobApplication':
      url = process.env.JOB_APPLICATION_URL
      break
    case 'reco':
      url = process.env.RECO_URL
      break
    case 'payment':
      url = process.env.PAYMENT_URL
      break
    case 'academy':
      url = process.env.ACADEMY_URL
      break
    case 'jobseeker':
      url = process.env.JOBSEEKER_URL
      break
    case 'company':
      url = process.env.COMPANY_URL
      break
    case 'config':
      url = process.env.CONFIG_URL
      break
    default:
      break
  }

  /*  TO REFACTOR */
  // Usecase: for roboheadhunting, need to pass specifically 'Bossjob-Token'
  if (baseURL === 'bosshunt' && type === 'protected' && getCookie('accessToken')) {
    headers = {
      ...headers,
      'Bossjob-Token': `Bearer ${getCookie('accessToken')}`
    }
  } else if (
    baseURL === 'job' &&
    type === 'protected' &&
    (getCookie('accessToken') || serverAccessToken)
  ) {
    const jobToken = getCookie('accessToken') || serverAccessToken
    headers = {
      ...headers,
      Authorization: `Bearer ${jobToken}`
    }
  } else if (baseURL === 'jobseeker' && type === 'protected' && serverAccessToken) {
    headers = {
      ...headers,
      Authorization: `Bearer ${serverAccessToken}`
    }
  } else {
    /*  END */
    if (type === 'protected' && getCookie('accessToken')) {
      headers = {
        ...headers,
        Authorization: `Bearer ${getCookie('accessToken')}`
      }
    }
    // if serverAccessToken exist, pass server access token
    // usecase: google one tap login pass token from server
    if (type === 'protected' && serverAccessToken) {
      headers = {
        ...headers,
        Authorization: `Bearer ${serverAccessToken}`
      }
    }
  }

  // pass token to backend if user is logged in, is viewing public page, and passToken attribute exist
  // Usecase: in headhunter detail page where back end needs to record down number of views and which user viewed the profile
  if (type === 'public' && getCookie('accessToken') && passToken) {
    headers = {
      ...headers,
      Authorization: `Bearer ${getCookie('accessToken')}`
    }
  }

  const configuredAxios = axios.create({
    baseURL: url,
    headers: headers
  })

  if (type === 'protected') {
    configuredAxios.interceptors.response.use(
      (response) => {
        return response
      },
      (error) => {
        // Remove the accessToken cookie to log the user out
        // when Unauthorized 401 status code is returned from API requests
        if (error?.response?.status === 401) {
          removeCookie('accessToken')
          window.location.href = '/get-started'
          IMManager?.logout?.()
          localStorage.clear()
        } else {
          return Promise.reject(error)
        }
      }
    )
  }

  return configuredAxios
}

export default configuredAxios
