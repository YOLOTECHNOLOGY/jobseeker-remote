
import { getCountryId, getLanguageId } from 'helpers/country'

import { fetchUserSetting } from 'store/services/swtichCountry/userSetting'
import { NextResponse } from 'next/server'
import { refreshToken as refreshTokenKey, accessToken as accessTokenKey, userKey } from 'helpers/cookies'

async function removeServiceCache(token, lang?) {
  try {
    const countryId = getCountryId()
    const languageId = getLanguageId()
    if (token) {
      // should fetch config here
      await fetchUserSetting({ country_id: countryId, language_id: languageId }, token)
        // .then((response) => console.log(response))
        .catch(({ response, request }) => console.log(response, request))
    }
  } catch (error) {
    console.log({ error })
  }

}
const isTest = false; // only true when develop at local
const localAddress = isTest ? ['http://local.dev.bossjob.ph:3005', 'http://local.dev.bossjob.sg:3005'] : []

export async function GET(request) {
  const params = new URL(request.url).searchParams
  const accessToken = params.get(accessTokenKey)
  const refreshToken = params.get(refreshTokenKey)
  const country = params.get('country')
  const user = params.get(userKey)
  const { url } = request
  const lang = url.split('//')[1].split('/')[1]
  if (accessToken) {
    await removeServiceCache(accessToken, lang)
  }
  const newUrl = localAddress.find(url => url.includes(country)) || process.env.NEXT_PUBLIC_HOST_PATH

  const response = new NextResponse(null, {
    status: 301,
    headers: {
      "Access-Control-Allow-Headers": "Set-Cookie",
      Location: `${newUrl}/${lang}`,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
    }
  })

  // set cookies with token in header
  // the maxAge unit is second
  const maxTime = 60 * 60 * 24 // a day
  response.cookies.set(accessTokenKey, accessToken, { path: '/', maxAge: accessToken ? maxTime : 0 })
  response.cookies.set(refreshTokenKey, `${refreshToken}`, { path: '/', maxAge: refreshToken ? maxTime : 0 })
  // clear the user data, and refetch the user data again
  response.cookies.set(userKey, user, { path: '/', maxAge: user ? maxTime : 0 })
  response.cookies.set('location', '', { path: '/', maxAge: 0 })

  return response
}

// export async function OPTIONS() {
//   return new Response(null, {
//     status: 204,
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Credentials': 'true',
//       'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS'
//       // "Access-Control-Allow-Headers": "Set-Cookie"
//     }
//   })
// }
