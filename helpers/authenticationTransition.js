/* Helpers */
import { getCookie } from 'helpers/cookies'

export const authPathToOldProject = (accessToken, redirectUrl) => {
  const authToken = accessToken ? accessToken : getCookie('accessToken')
  const oldProjectUrl = `${process.env.OLD_PROJECT_URL}/jobseeker-login-redirect`
  // oldProjectUrl += '/jobseeker-login-redirect?token=' + authToken + '&redirectUrl=' + redirectUrl
  const oldProjectPath = {
    pathname: oldProjectUrl,
    query: {
      token: authToken,
      redirectUrl: redirectUrl,
    },
  }
  return oldProjectPath
}
