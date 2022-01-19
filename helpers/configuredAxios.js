import axios from 'axios'
import { getCookie } from 'helpers/cookies'
// import { configureStore } from 'store'
// import { logout } from 'shared/helpers/authentication'

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
    case 'search':
      url = process.env.SEARCH_BOSSJOB_URL
      break
    case 'chat':
      url = process.env.CHAT_BOSSJOB_URL
      break
    case 'reco':
      url = process.env.RECO_URL
      break
    case 'payment':
      url = process.env.PAYMENT_URL
      break
    case 'job':
      url = process.env.DATA_BOSSJOB_JOB_URL
      break
    default:
      break
  }

  const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYmViNTNlMTlmN2M3NTliOTVjNDQ0OWYwMWQ5MmFiMzg1MmRhM2JhOTc2Y2NiYTcyZDRlNTBiNDBiZDFhMGExMjJiZTQ1MTlhY2NjZjNlMzUiLCJpYXQiOjE2NDI1MDY5ODUuNDQ0NTY4LCJuYmYiOjE2NDI1MDY5ODUuNDQ0NTc0LCJleHAiOjE2NDMxMTE3ODUuMjA0NTQzLCJzdWIiOiIxODIwIiwic2NvcGVzIjpbXX0.eCs96nXrxP8z55S-MUq10oVeIJW-zkFI_9W008edsQ1phJ4pPf2NRXUZqocSVUFQMseSWyGZtYfftWwvfw2ULeIzdWmFEnYNz5EV7mHtY2dsimO4m81RbJ9E5zS5mnp5u5CmCnT3PN_UFl7NEAmM3qx7PDrpRyFPwI5KKiQL5LcLLC8bxWpKhzquHgqKvJt1wcwEof2j9Sl3akpnf-KboVMvsjjpYrNUUx6xxEeZ0j1ahYLRqXiwR21Oms3LkyWYGVb6l8bUJ3jeS-RMi-8nnJnYyfkrIGTmLp-5XSXojaI-ukjrcc_GZpMA76wT39ZPZLVS6QaaLyeKeLZkFS0aPyhJqQp0zn9uPLNJlzy2vURe2I7nn78Mxqk7Ebg0ZGbAyPF8MTqqBpLkyd2U6JZhTj1IwhfFIdi5Y0wbkXDf-kdxLcm8ou3LEKa7oSE9bw-TvqSMZ7qR_zlRyiunc0RO3kzKg3WqVRM707gXcK58v5L_O8w2E66wlizxtGCdOQhhpFRLZMIaR6n4fMLFyf3qcFaOQWQuRXbiagWXFEqY76cTg4XO9P8A-S6pGzFjrJJHUett53fIQtu5CJBmDXYaaCsZwv2OVWOCQcb4MJPNcHcXnfSgHzGBMEKr8cYd3h1A0EhtQI3B5kYmn4aX_Uclxe4jIxd9jQsV6ytZJOP28SA'

  /*  TO REFACTOR */
  // Usecase: for roboheadhunting, need to pass specifically 'Bossjob-Token'
  if (baseURL === 'bosshunt' && type === 'protected' && getCookie('accessToken')) {
    headers = {
      ...headers,
      'Bossjob-Token': `Bearer ${getCookie('accessToken')}`,
    }
  }
  else if (baseURL === 'job' && type === 'protected' && token) {
    headers = {
      ...headers,
      'Bossjob-Token': `Bearer ${token}`,
    }
  }
  else {
    /*  END */
    if (type === 'protected' && getCookie('accessToken')) {
      headers = {
        ...headers,
        Authorization: `Bearer ${getCookie('accessToken')}`,
      }
    }
    // if serverAccessToken exist, pass server access token
    // usecase: google one tap login pass token from server
    if (type === 'protected' && serverAccessToken) {
      headers = {
        ...headers,
        Authorization: `Bearer ${serverAccessToken}`,
      }
    }
  }

  // pass token to backend if user is logged in, is viewing public page, and passToken attribute exist
  // Usecase: in headhunter detail page where back end needs to record down number of views and which user viewed the profile
  if (type === 'public' && getCookie('accessToken') && passToken) {
    headers = {
      ...headers,
      Authorization: `Bearer ${getCookie('accessToken')}`,
    }
  }

  const configuredAxios = axios.create({
    baseURL: url,
    headers: headers,
  })

  if (type === 'protected' && getCookie('accessToken')) {
    configuredAxios.interceptors.response.use(
      (response) => {
        return response
      },
      (error) => {
        if (error.message === 'Request failed with status code 401') {
          // logout()
          window.location.href = '/'
        } else {
          return Promise.reject(error)
        }
      }
    )
  }

  return configuredAxios
}

export default configuredAxios