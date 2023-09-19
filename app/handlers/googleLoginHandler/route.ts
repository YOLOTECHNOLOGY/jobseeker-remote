import axios from 'axios'
import { handleUserCookiesConfig } from 'helpers/cookies'
import { redirectUrlKey } from 'helpers/globalKey'
import { parse } from 'next-useragent'
import { NextRequest, NextResponse } from 'next/server'
import { socialLoginService } from 'store/services/auth/socialLogin'
export const revalidate = 60000
export async function GET(request: NextRequest) {
    const searchParams = new URL(request.url).searchParams
    const accessToken = searchParams.get('access_token')
    const activeKey = searchParams.get('active_key')
    const redirectUrl = searchParams.get(redirectUrlKey)
    const userAgent = parse(request.headers.get('user-agent'))
    const fcmToken = searchParams.get('fcmToken')
    return axios
        .get('https://oauth2.googleapis.com/tokeninfo?id_token=' + accessToken)
        .then(async ({ data }) => {
            const payload = {
                user_id: data.sub,
                email: data.email,
                first_name: data.family_name,
                last_name: data.given_name,
                avatar: data.picture,
                token: accessToken,
                social_type: 'google-one-tap',
                source: userAgent.isMobile ? 'mobile_web' : 'web',
                social_user_token: accessToken,
                social_user_id: data.sub,
                active_key: activeKey,
                fcm_token_web_jobseeker: fcmToken
            }
            return socialLoginService(payload)
        })
        .then(response => {
            if (response.status >= 200 && response.status < 300) {
                const userCookie = handleUserCookiesConfig(response.data.data)
                const res = new NextResponse(null, {
                    status: 301,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Credentials': 'true',
                        'Access-Control-Allow-Methods': 'GET',
                    }
                })
                const setCookie = (name, value) => {
                    res.cookies.set(name, value, { path: '/', maxAge: 3600000 })
                }
                setCookie('accessToken', response.data.data?.token)
                setCookie('refreshToken', response.data?.data?.refresh_token)
                setCookie('user', JSON.stringify(userCookie))
                res.headers.set('Location', redirectUrl ?? '/')
                return res
            }
        })
        .catch((e) => {
            if (e.response) {
                return new NextResponse(e.response.data, {
                    status: e.response.status,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Credentials': 'true',
                        'Access-Control-Allow-Methods': 'GET',
                    }
                })
            } else {
                return new NextResponse(e?.response?.data, {
                    status: 500,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Credentials': 'true',
                        'Access-Control-Allow-Methods': 'GET',
                    }
                })
            }
        })
}