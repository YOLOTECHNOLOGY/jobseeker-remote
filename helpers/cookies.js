import moment from 'moment'
import Cookies from 'universal-cookie'

const cookies = new Cookies()

export const setCookie = (cookieName, data) => {
  cookies.set(cookieName, data, {
    path: '/',
    expires: new Date(moment().add(1, 'M').utc().format())
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
