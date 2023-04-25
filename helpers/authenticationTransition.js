/* Helpers */
import { getCookie } from 'helpers/cookies'

export const authPathToOldProject = (accessToken, redirectUrl) => {
  const authToken = accessToken ? accessToken : getCookie('accessToken')
  const isAppRedirectModalClosed = getCookie('isAppRedirectModalClosed') ? 'true': 'false'
  
  redirectUrl = `${process.env.OLD_PROJECT_URL}/jobseeker-login-redirect?redirectUrl=${redirectUrl}`
  const delimiter = '/jobseeker-login-redirect?redirectUrl='
  const redirectArray = redirectUrl.split(delimiter)

  // Encode url params 
  if (redirectArray.length === 2) {
    const queryParam = redirectArray[1]
    const encodedQueryParam = encodeURIComponent(queryParam)
    const encodedRedirect = ''
    encodedRedirect.concat(redirectArray[0], delimiter, encodedQueryParam)
    redirectUrl = redirectArray[0] + delimiter + encodedQueryParam
  }

  if (authToken) {
    return `${redirectUrl}&token=${authToken}&isAppRedirectModalClosed=${isAppRedirectModalClosed}`
  }

  return `${redirectUrl}&isAppRedirectModalClosed=${isAppRedirectModalClosed}`
}
