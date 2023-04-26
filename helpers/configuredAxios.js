import axios from 'axios'
import { getCookie, removeCookie, setCookie } from 'helpers/cookies'
import { accessToken, refreshToken } from './cookies';
import { getCountryId } from './country';
import { NextResponse } from 'next/server';
// import accessToken from 'pages/api/handlers/linkedinHandlers/accessToken'
// import { configureStore } from 'store'
// import { logout } from 'shared/helpers/authentication'
// import { IMManager } from 'imforbossjob'

let timer = 0;
const clearTime = () => clearTimeout(timer)
const autoRefreshToken = () => {
  timer = setTimeout(() => {
    clearTime()
    refreshTokenServer();
    autoRefreshToken();
    // Refresh every 25 minutes
  }, 1000 * 60 * 25);
}

// generate url by a baseUrl
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
    default:
      break
  }
  return url
}

const configuredAxios = (baseURL, type = 'public', passToken, serverAccessToken) => {
  // let remoteAddress = ''
  // let isMobile = ''
  if (typeof window !== 'undefined') {
    // const { store } = configureStore(window.__PRELOADED_STATE__, false)
    // remoteAddress = store.getState().Public.utils.setRemoteIp.ip
    // isMobile = store.getState().Public.utils.setUserDevice.userAgent.isMobile
  }

  const url = getUrl(baseURL)
  let headers = {
    // remoteAddress: remoteAddress,
    // source: isMobile ? 'mobile-web' : 'web',
    'Country-Id': getCountryId()
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



const refreshTokenServer = () => {
  const axios = configuredAxios('auth', '', '', '');
  const data = { source: 'web', refresh: getCookie(refreshToken) }
  return axios.post('/token/refresh', data).then((res) => {
    const { access, token_expired_at, data } = res.data.data
    console.log({ 'res.data.data': res.data.data })
    if (access) {
      clearTime()
      autoRefreshToken()
      setCookie(accessToken, access, token_expired_at)
      return
    }
    // if goes in this statement, the data is 'refreshtoken expiration of identity'
    return Promise.reject(new Error(data))
  })
}
const redirectToHomeOnClient = () => {
  if (typeof window !== 'undefined') {
    removeCookie(accessToken)
    window.location.href = '/get-started'
    import('imforbossjob')
      .then((im) => im?.IMManager?.logout?.())
      .then(() => localStorage?.clear?.())
  } else {
    NextResponse.next().redirect('/get-started', 301)
  }
}

// let globalPromise;
globalThis.globalPromise = null
const chain = configured => (baseURL, type = 'public', passToken, serverAccessToken, server = typeof window === 'undefined') => {
  const createAxios = () => configuredAxios(baseURL, type, passToken, serverAccessToken, server)
  const axios = createAxios();
  const keys = Object.keys(axios);
  const wrapper = {};

  keys.forEach(key => {
    wrapper[key] = (...params) => {
      if (type === 'protected') {
        axios.interceptors.response.use(
          (response) => response,
          (error) => {

            // if (error?.response?.status === 401 && server) {
            //   console.log('server401', error,  error.request)
            //   redirect(process.env.HOST_PATH + '/refresh-token')
            // }
            if (error?.response?.status === 401 && typeof window !== 'undefined') {
              if (configured) {
                redirectToHomeOnClient();
                return Promise.reject(error)
              }
              if (!globalPromise) {
                globalThis.globalPromise = refreshTokenServer().catch(error => {
                  redirectToHomeOnClient()
                }).finally(() => {
                  setTimeout(() => {
                    globalPromise = undefined;
                  }, 1000 * 60 * 2);
                })
              }
              return globalPromise.then((res) => {
                const chainObj = chain(true)(baseURL, type, passToken ? getCookie(accessToken) : '', serverAccessToken ? getCookie(accessToken) : '', server)
                return chainObj[key](...params)
              })
            } else if (error?.response?.status === 401 && typeof window !== 'undefined') {
              // const response = NextResponse.next()
              // response.cookies
              // if (configured) {
              //   redirectToHomeOnClient();
              //   return Promise.reject(error)
              // }
              // if (!globalPromise) {
              //   globalThis.globalPromise = refreshTokenServer().catch(() => {
              //     redirectToHomeOnClient()
              //   }).finally(() => {
              //     setTimeout(() => {
              //       globalPromise = undefined;
              //     }, 1000 * 60 * 2);
              //   })
              // }
              // return globalPromise.then(() => {
              //   const chainObj = chain(true)(baseURL, type, passToken ? getCookie(accessToken) : '', serverAccessToken ? getCookie(accessToken) : '', server)
              //   return chainObj[key](...params)
              // })
            } else {

              return Promise.reject(error)
            }
          }
        )
      }
      return axios[key](...params);
    }
  });
  return wrapper
}

export default chain()
