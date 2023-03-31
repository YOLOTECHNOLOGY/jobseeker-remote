import moment from 'moment'
import Cookies from 'universal-cookie'

export const userKey = 'user';
export const refreshToken = 'refreshToken';
export const accessToken = 'accessToken'

const cookies = new Cookies()

export const setCookie = (cookieName, data, expireTime) => {
  cookies.set(cookieName, data, {
    path: '/',
    expires: expireTime ? new Date(expireTime) : new Date(moment().add(1, 'M').utc().format())
  })
}

export const getCookie = (cookieName) => {
  return cookies.get(cookieName)
}

export const removeCookie = (cookieName) => {
  cookies.remove(cookieName, { path: '/' })
}

export const setCookieWithExpiry = (cookieName, data, timeToExpiry) => {
  cookies.set(cookieName, data, { path: '/', maxAge: timeToExpiry })
}
