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
import { setCookie } from 'helpers/cookies'
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
              social_type: 'google',
              source: userAgent.isMobile ? 'mobile_web' : 'web',
              social_user_token: accessToken,
              social_user_id: data.sub,
              active_key: activeKey
            }

            try {
              await socialLoginService(payload).then(async (response) => {
                console.log({ socialLoginResponse: response })
                dispatch(socialLoginSuccess({}))
                console.log({ response })
                if (response.status >= 200 && response.status < 300) {
                  const userCookie = {
                    active_key: response.data.data.active_key,
                    id: response.data.data.id,
                    first_name: response.data.data.first_name,
                    last_name: response.data.data.last_name,
                    email: response.data.data.email,
                    phone_num: response.data.data.phone_num,
                    is_mobile_verified: response.data.data.is_mobile_verified,
                    avatar: response.data.data.avatar,
                    additional_info: response.data.data.additional_info,
                    is_email_verify: response.data.data.is_email_verify,
                    notice_period_id: response.data.data.notice_period_id,
                    is_profile_completed: response.data.data.is_profile_completed
                  }

                  setCookie('accessToken', response.data.data?.token)
                  setCookie('user', userCookie)
                  console.log({ redirectUrl })
                  if (typeof window !== 'undefined') {
                    sessionStorage.removeItem('socialLogin')
                    window.location.href = redirectUrl ?? '/'
                  }
                }

              })
            } catch (err) {
              console.log({ err })
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
