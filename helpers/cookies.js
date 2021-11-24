import Cookies from 'universal-cookie'

const cookies = new Cookies()

export const setCookie = (cookieName, data) => {
  cookies.set(cookieName, data, { path: '/' })
}

export const getCookie = (cookieName) => {
  return cookies.get(cookieName)
}

export const removeCookie = (cookieName) => {
  cookies.remove(cookieName, { path: '/' })
}
