'use client'
import { useEffect } from 'react'
import axios from 'axios'
// @ts-ignore
import { socialLoginService } from 'store/services/auth/socialLogin'
import { socialLoginSuccess, socialLoginFailed } from 'store/actions/auth/socialLogin'
import { setUserDevice } from 'store/actions/utility/setUserDevice'
// Components
import Text from 'components/Text'
// Helpers
import { handleUserCookiesConfig, setCookie } from 'helpers/cookies'
import { useDispatch } from 'react-redux'
import { message } from 'antd'
import { parse } from 'next-useragent'

interface IGoogleLoginHandler {
  accessToken: string
  activeKey: any
  redirectUrl: any
}

const googleLoginHandler = ({
  accessToken,
  activeKey,
  redirectUrl
}: IGoogleLoginHandler) => {
  const dispatch = useDispatch()
  useEffect(() => {
    if (sessionStorage.getItem('socialLogin')) {
      return
    }
    const userAgent = parse(navigator.userAgent)
    sessionStorage.setItem('socialLogin', 'true')
      ; (async () => {
        // dispatch(setRemoteIp(remoteIp))
        dispatch(
          setUserDevice({
            isiOS: userAgent.isIphone || userAgent.isIpad,
            isAndroid: userAgent.isAndroid,
            isMobile: userAgent.isMobile,
            isTablet: userAgent.isTablet,
            isDesktop: userAgent.isDesktop,
            operatingSystem: userAgent.os
          })
        )
        await axios
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
              active_key: activeKey
            }

            try {
              await socialLoginService(payload).then(async (response) => {
                dispatch(socialLoginSuccess({}))
                if (response.status >= 200 && response.status < 300) {
                  const userCookie = handleUserCookiesConfig(response.data.data)
                  setCookie('accessToken', response.data.data?.token)
                  setCookie('user', userCookie)
                  if (typeof window !== 'undefined') {
                    sessionStorage.removeItem('socialLogin')
                    window.location.href = redirectUrl ?? '/'
                  }
                }

              })
            } catch (err) {
              message.error('Login failed')
              dispatch(socialLoginFailed(err))
              sessionStorage.removeItem('socialLogin')
            }
          })
          .catch(() => {
            message.error('Login failed')
          })
      })()
  }, [])

  return <Text>Logging In...</Text>
}


export default googleLoginHandler
