
import { defaultLanguage, getCountryId, getLanguageId } from 'helpers/country'

import { fetchUserSetting } from 'store/services/swtichCountry/userSetting'
import { NextResponse } from 'next/server'
import { refreshToken as refreshTokenKey, accessToken as accessTokenKey, userKey, } from 'helpers/cookies'
import { redirectUrlKey } from 'helpers/globalKey'

async function removeServiceCache(token) {
  try {
    const countryId = getCountryId()
    const languageId = getLanguageId()
    if (token) {
      // should fetch config here
      await fetchUserSetting({ country_id: countryId, language_id: languageId }, token)
        .catch(({ response, request }) => console.log(response, request))
    }
  } catch (error) {
    console.log({ error })
  }

}

export async function GET(request, pathParams) {
  const params = new URL(request.url).searchParams
  const accessToken = params.get(accessTokenKey)
  const refreshToken = params.get(refreshTokenKey)
  const pathname = params.get(redirectUrlKey) ?? '';
  // // vip search parameters
  // const otherSearchParams = ['referral_code', 'invited_source'].map((key) => {
  //   const value = params.get(key);

  //   return value ? `${key}=${value}` : undefined
  // }).filter(v => !!v).join('&');

  // const country = params.get('country')
  const user = params.get(userKey)
  const lang = pathParams.params?.lang ?? defaultLanguage()
  if (accessToken) {
    await removeServiceCache(accessToken)
  }
  // 取得request的host
  const host = request.headers.get('host')
  // 取得request的protocol
  const protocol = request.headers.get('x-forwarded-proto') || 'http'
  // const newUrl = process.env.NEXT_PUBLIC_HOST_PATH
  const response = NextResponse.redirect(`${protocol}://${host}/${lang}/${pathname}`)
  // + (otherSearchParams ? `?${otherSearchParams}` : ''))

  const maxTime = 60 * 60 * 24 // a day
  response.cookies.set(accessTokenKey, accessToken, { path: '/', maxAge: accessToken ? maxTime : 0 })
  response.cookies.set(refreshTokenKey, `${refreshToken}`, { path: '/', maxAge: refreshToken ? maxTime : 0 })
  // clear the user data, and refetch the user data again
  response.cookies.set(userKey, user, { path: '/', maxAge: user ? maxTime : 0 })
  response.cookies.delete('location')

  return response
}

