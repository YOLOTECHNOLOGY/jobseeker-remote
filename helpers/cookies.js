// @ts-check
import moment from 'moment'
import Cookies from 'universal-cookie'
import { toLower } from 'lodash-es'

export const userKey = 'user'
export const refreshToken = 'refreshToken'
export const accessToken = 'accessToken'
export const redirectUrl = 'redirectUrl'
export const sourceKey = 'source' // track source
export const configKey = 'geoConfiguration'

// session keys
export const cfKey = 'cfKey'

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
/**
 * remove the user's data in browser
 */
export const removeUserCookie = () => {
  removeCookie(accessToken)
  removeCookie(refreshToken)
  removeCookie(userKey)
}

export const handleUserCookiesConfig = (user) => {
  return {
    active_key: user?.active_key,
    id: user?.id,
    first_name: user?.first_name,
    last_name: user?.last_name,
    email: user?.email,
    phone_num: user?.phone_num,
    is_mobile_verified: user?.is_mobile_verified,
    avatar: user?.avatar,
    additional_info: user?.additional_info,
    is_email_verify: user?.is_email_verify,
    notice_period_id: user?.notice_period_id,
    is_profile_completed: user?.is_profile_completed,
    longitude: user?.longitude,
    latitude: user?.latitude
  }
}
