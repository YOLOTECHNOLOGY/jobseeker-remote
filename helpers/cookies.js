import moment from 'moment'
import Cookies from 'universal-cookie'
import { toLower } from 'lodash-es'
export const userKey = 'user';
export const refreshToken = 'refreshToken';
export const accessToken = 'accessToken';
export const sourceKey = 'source'; // track source

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

export const setSourceCookie = (data) => {
  setCookie(sourceKey, toLower(data))
}

export const getSourceCookie = () => {
  return getCookie(sourceKey) || 'job_search'
}