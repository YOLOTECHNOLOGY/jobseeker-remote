
import { getCountryId, getLangKeyByCode, getLanguageId } from 'helpers/country'

import { fetchUserSetting } from 'store/services/swtichCountry/userSetting'
import { NextResponse } from 'next/server'
import { refreshToken as refreshTokenKey, accessToken as accessTokenKey, userKey, redirectUrl, accessToken } from 'helpers/cookies'
import axios from 'axios'
import { fetchUserOwnDetailService } from 'store/services/users/fetchUserOwnDetail'
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

export async function GET(request) {
  const params = new URL(request.url).searchParams
  const huntAccessToken = params.get(accessTokenKey)
  const redirect = params.get('redirect')
  const langCode = params.get('lang')
  const lang = getLangKeyByCode(langCode)
  const headers = {
    'Authorization': `Bearer ${huntAccessToken}`
  }
  const configuredAxios = axios.create({
    url: process.env.AUTH_BOSSJOB_URL,
    headers: headers,
    proxy: false,
    timeout: 1000 * 60
  })
  const result = await configuredAxios.post(`${process.env.AUTH_BOSSJOB_URL}/authentication/switch-role`, {
    source: 'web'
  })
  const accessToken = result?.data?.data?.access_token
  const refreshToken = result?.data?.data?.refresh_token
  if (accessToken) {
    await removeServiceCache(accessToken)
  }

  const response = new NextResponse(null, {
    status: 301,
    headers: {
      "Access-Control-Allow-Headers": "Set-Cookie",
      Location: `${lang}/${redirect} `,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
    }
  })

  const meResponse = await fetchUserOwnDetailService({ accessToken })
  const loginData = meResponse?.data?.data
  const userCookie = {
    active_key: loginData.active_key,
    id: loginData.id,
    first_name: loginData.first_name,
    last_name: loginData.last_name,
    email: loginData.email,
    phone_num: loginData.phone_num,
    is_mobile_verified: loginData.is_mobile_verified,
    avatar: loginData.avatar,
    additional_info: loginData.additional_info,
    is_email_verify: loginData.is_email_verify,
    notice_period_id: loginData.notice_period_id,
    is_bosshunt_talent: loginData.is_bosshunt_talent,
    is_bosshunt_talent_active: loginData.is_bosshunt_talent_active,
    bosshunt_talent_opt_out_at: loginData.bosshunt_talent_opt_out_at,
    is_profile_completed: loginData.is_profile_completed
  }
  console.log({ userCookie })
  const user = JSON.stringify(userCookie)
  const maxTime = 60 * 60 * 24 // a day
  response.cookies.set(accessTokenKey, accessToken, { path: '/', maxAge: accessToken ? maxTime : 0 })
  response.cookies.set(refreshTokenKey, `${refreshToken} `, { path: '/', maxAge: refreshToken ? maxTime : 0 })
  // clear the user data, and refetch the user data again
  response.cookies.set(userKey, user, { path: '/', maxAge: user ? maxTime : 0 })
  response.cookies.delete('location')

  return response
}

