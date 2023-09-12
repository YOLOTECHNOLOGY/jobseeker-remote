import axios from 'axios'
import { getCookie, removeUserCookie, setCookie } from 'helpers/cookies'
import { accessToken, refreshToken } from './cookies';
import { getCountryId } from './country';
import { NextResponse } from 'next/server';
import logError from 'app/errors/logError';

const getUrl = (baseURL) => {
  let url = '';
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
    case 'recruiters':
      url = process.env.RECRUITERS_BOSSJOB_URL
      break
    case 'resumes':
      url = process.env.RESUME_URL
      break
    case 'resumeTemplate':
      url = process.env.RESUME_TEMPLATE_URL
      break
    default:
      break
  }
  return url
}

const configuredAxios = (baseURL, type = 'public', passToken, serverAccessToken) => {

  const url = getUrl(baseURL)
  let headers = {
    'Country-Id': '' + getCountryId()
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
  });

  return configuredAxios
}

const redirectToHomeOnClient = () => {
  if (typeof window !== 'undefined') {
    removeUserCookie();
    window.location.href = '/get-started'
    if (typeof window !== 'undefined') {
      import('bossjob-remote/dist/clientStorage')
        .then(clientStorage => clientStorage?.postNotification?.('IM_LOGOUT'))
    }
  } else {
    // seems this code is not working
    const response = NextResponse.redirect('/get-started', 301)
    response.cookies.delete(accessToken)
    response.cookies.delete(refreshToken)
  }
}
const refreshTokenServer = () => {
  const axios = configuredAxios('auth', '', '', '');
  const refreshKey = getCookie(refreshToken)
  const data = { source: 'web', refresh: refreshKey }
  if (!refreshKey) {
    redirectToHomeOnClient()
    return Promise.reject(new Error('no refresh token!!'))
  }
  return axios.post('/token/refresh', data).then((res) => {
    const { access, token_expired_at, data } = res.data.data
    if (access) {
      setCookie(accessToken, access, token_expired_at)
      return
    }
    // if goes in this statement, the data is 'refreshtoken expiration of identity'
    return Promise.reject(new Error(data))
  })
}

globalThis.globalPromise = null
if (typeof window !== undefined) {
  import('bossjob-remote/dist/clientStorage')
    .then(({ publishSharedData, receiveNotification }) => {
      publishSharedData('REFRESH_TOKEN_TASK', globalThis.globalPromise)
      receiveNotification('REQUEST_401', data => shouldRefresh(data.note))
    })
}

const shouldRefresh = async error => {
  const { publishSharedData } = await import('bossjob-remote/dist/clientStorage')
  if (!globalPromise) {
    globalThis.globalPromise = refreshTokenServer().catch(() => {
      redirectToHomeOnClient()
    }).finally(() => {
      setTimeout(() => {
        globalPromise = undefined;
        publishSharedData('REFRESH_TOKEN_TASK', globalThis.globalPromise)
      }, 1000 * 60 * 2);
    })
    publishSharedData('REFRESH_TOKEN_TASK', globalThis.globalPromise)
  }
  return globalPromise.then(() => {
    // 重新请求
    axios.request({
      ...error.config,
      headers: {
        ...error.config.headers,
        Authorization: `Bearer ${getCookie('accessToken')}`
      }
    })
  })
}

const chain = configured => (baseURL, type = 'public', passToken, serverAccessToken, server = typeof window === 'undefined') => {
  let axios = null
  axios = configuredAxios(baseURL, type, passToken, serverAccessToken, server)
  // 添加响应拦截器
  axios.interceptors.response.use((response) => response,
    (error) => {
      logError(error?.response?.data ?? error?.response ?? error)
      if (error?.response?.status === 401 && typeof window !== 'undefined') {
        if (configured) {
          redirectToHomeOnClient();
          return Promise.reject(error)
        }
        return shouldRefresh(error)
      } else if (error?.response?.status === 401) {
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject(401) // will redirect to error page, that code in the _app.tsx
      } else {
        return Promise.reject(error)
      }
    });
  return axios
}

export default chain()
