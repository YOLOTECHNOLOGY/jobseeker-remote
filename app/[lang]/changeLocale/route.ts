import { cookies } from 'next/headers'

import { getCountryId, getLanguageId } from 'helpers/country'

import { fetchUserSetting } from 'store/services/swtichCountry/userSetting'

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

export async function GET(request) {
 
  const accessToken = new URL(request.url).searchParams.get('accessToken')
  const { url } = request
  const lang = url.split('//')[1].split('/')[1]
  await removeServiceCache(accessToken, lang)

  return new Response(null, {
    status: 301,
    headers: {
      'Set-Cookie': `accessToken=${accessToken}`,
      Location: process.env.NEXT_PUBLIC_HOST_PATH,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS'
      // "Access-Control-Allow-Headers": "Set-Cookie"
    }
  })
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
