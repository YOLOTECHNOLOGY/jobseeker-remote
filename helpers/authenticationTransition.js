/* Helpers */
import { getCookie } from 'helpers/cookies'

export const authPathToOldProject = (accessToken, redirectUrl) => {
  const authToken = accessToken ? accessToken : getCookie('accessToken')
  const isAppRedirectModalClosed = getCookie('isAppRedirectModalClosed') ? 'true': 'false'
  const oldProjectUrl = `${process.env.OLD_PROJECT_URL}/jobseeker-login-redirect`
  // const oldProjectPath = {
  //   pathname: oldProjectUrl,
  //   query: {
  //     token: authToken,
  //     redirectUrl: redirectUrl,
  //   },
  // }
  // return oldProjectPath
  if (authToken) {
    return `${oldProjectUrl}?redirectUrl=${redirectUrl}&token=${authToken}&isAppRedirectModalClosed=${isAppRedirectModalClosed}`
  }

  return `${oldProjectUrl}?redirectUrl=${redirectUrl}&isAppRedirectModalClosed=${isAppRedirectModalClosed}`
}
