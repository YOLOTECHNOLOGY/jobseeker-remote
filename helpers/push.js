import {
  accessToken as accessTokenKey,
  refreshToken as refreshTokenKey,
  getCookie,
  userKey,
} from './cookies'
import { getLang } from './country'

export const pushToResume = path => {
  const accessToken = getCookie(accessTokenKey)
  const refreshToken = getCookie(refreshTokenKey)

  const user = getCookie(userKey)
  const resumeUrl = process.env.RESUME_TEMP_URL
  const lang = getLang()
  if (!accessToken || !refreshToken) {
    window.open(`${resumeUrl}/${lang}/${path}`)
  } else {
    const params = new URLSearchParams()
    params.append(accessTokenKey, accessToken)
    params.append(refreshTokenKey, refreshToken)
    params.append(userKey, user ?? '')
    params.append('redirect', path)
    window.open(`${resumeUrl}/${lang}/redirct?${params.toString()}`)
  }
}
