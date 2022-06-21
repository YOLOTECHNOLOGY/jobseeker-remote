import { useEffect } from 'react'

// Vendor
import { useUserAgent } from 'next-useragent'
import axios from 'axios'
import { useRouter } from 'next/router'

// Store
import { wrapper } from 'store'
// @ts-ignore
import { END } from 'redux-saga'
import { socialLoginService } from 'store/services/auth/socialLogin'
import {
  socialLoginSuccess,
  socialLoginFailed
} from 'store/actions/auth/socialLogin'
import { setRemoteIp } from 'store/actions/utility/setRemoteIp'
import { setUserDevice } from 'store/actions/utility/setUserDevice'

// Components
import Text from 'components/Text'

// Helpers
import { setCookie } from 'helpers/cookies'

interface IGoogleLoginHandler {
  accessToken: string
  userCookie: any
}

const googleLoginHandler = ({
  accessToken,
  userCookie
}: IGoogleLoginHandler) => {
  const router = useRouter()

  useEffect(() => {
    if (accessToken && userCookie) {
      setCookie('accessToken', accessToken)
      setCookie('user', userCookie)

      router.push('/')
    }
  }, [])

  return <Text>Logging In...</Text>
}

export const getServerSideProps = wrapper.getServerSideProps((store) => async (ctx) => {
  const { query, req} = ctx

  let bossjobAccessToken = null
  let userCookie = null
  const accessToken = query.access_token
  const activeKey = query.active_key
  const userAgent = useUserAgent(req.headers['user-agent'])
  const remoteIp = req.connection.remoteAddress

  store.dispatch(setRemoteIp(remoteIp))
  store.dispatch(setUserDevice({
    isiOS: userAgent.isIphone || userAgent.isIpad,
    isAndroid: userAgent.isAndroid,
    isMobile: userAgent.isMobile,
    isTablet: userAgent.isTablet,
    isDesktop: userAgent.isDesktop,
    operatingSystem: userAgent.os
  }))

  await axios.get('https://oauth2.googleapis.com/tokeninfo?id_token=' + accessToken)
    .then(async ({data}) => {
      const payload = {
        user_id: data.sub,
        email: data.email,
        first_name: data.family_name,
        last_name: data.given_name,
        avatar: data.picture,
        token: accessToken,
        social_type: 'google',
        source: `google-one-tap-${userAgent.isMobile ? 'mobile' : 'web'}`,
        active_key: activeKey
      }

      try {
        await socialLoginService(payload)
          .then(async (response) => {
            store.dispatch(socialLoginSuccess({}))

            if (response.status >= 200 && response.status < 300) {
              userCookie = {
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
                is_profile_completed: response.data.data.is_profile_completed,
              }

              bossjobAccessToken = response.data.data.authentication.access_token
            }
          })
      } catch(err) {
        store.dispatch(socialLoginFailed(err))
      }
    })

  store.dispatch(END)
  await (store as any).sagaTask.toPromise()
  
  return { 
    props: {
      accessToken: bossjobAccessToken,
      userCookie,
    },
  }
})

export default googleLoginHandler