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

  const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNTcwNzdiNTU2ODM4MjAzN2EzNmNlNDI0OWFhYTUzMzZkNjViM2U4M2JiODVjYTFlMjRhODAyNGI3N2IwMzhiYzIxOGE1ZjExNjA0NDc0M2MiLCJpYXQiOjE2NDMxMDIwMjcuNTE0MTg1LCJuYmYiOjE2NDMxMDIwMjcuNTE0MTg4LCJleHAiOjE2NDM3MDY4MjcuMjg5MDM2LCJzdWIiOiIxODIwIiwic2NvcGVzIjpbXX0.TbyTip_Xsg2KLwoq7UrDA5U1hrHCQY9kQyXeIj2I2UXvyIYsXS3mm5oy8eMuTl3lc9pjUJR_TU4GroTKhyI5mU_2jhkItRo32upJvLJZg8b3M6Hm0HAz5ovebVCr4k4ug2yeA1z_VRZn0JDw2WqDUpsZNZONKXFkuWY4vlm8Vlz5-HcfHw-JUrXXlqPYX0iXkParrTdhQuqBeOstD_uWVNlXjGRFA3NQqqTvPJoQsQWX86y1FxR8Fbt-fhSNO0aSi8JUESxe7FWyYjXp5btLFGQjQSwSEL8vpkLC-Aew7xGg53Z_7cygm56m3ik2nkYOLncdBi-LPiOh8kIsOmVqXu9EvZRymFqOlSDKUGJx7fpIZN7rU0gPbilKJzrrIL9IXx6rXVXZ7ANR0MO-rVG3X3LsM9ouQnFdnBXprq7hJpnJnCj88gtaW2jDrvS94jcQfDxqn9ZeayJNNfK76JVxTX2OJ0yu-SjOH7vepFU63R-iYDycSItks7dF2lVPnnEPk4Mf9xZ59Y_VuJ4_r3zfdbrKsnU6R6S-BHNh7sXpej8-T3rYoZ4VXjy9Jp8xItFuLXqbQRuN-yk2SouxcdUY-dr7Q-ly46eCzGLUfu3L6DTfgcSwNHFuPDL7NrHGoVhwPr2mSpgwX9k31tfss_JznDDYP5LG1NIV-pTnbLrEO2Y'

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