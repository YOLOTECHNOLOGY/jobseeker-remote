import React from 'react'
import { useSearchParams } from 'next/navigation'
import { isMobile } from 'react-device-detect'

import { removeItem } from 'helpers/localStorage'
import useGetStarted from '../../hooks/useGetStarted'

import styles from '../../index.module.scss'

interface IFacebook {
  className?: string
  activeKey?: number
  isLogin?: boolean
  redirect?: string | string[]
  lang: any
  showTitle?: boolean
}

const FacebookLogin = (props: IFacebook) => {
  const {
    activeKey,
    isLogin,
    redirect,
    lang: { newGetStarted },
    showTitle = true
  } = props
  const searchParams = useSearchParams()
  const { defaultLoginCallBack, handleAuthenticationSocialLogin } = useGetStarted()
  const query = {}
  for (const entry of searchParams.entries()) {
    query[entry[0]] = entry[1]
  }

  // handle login us service
  const callBackMethod = (payload) => {
    const data = {
      ...payload,
      ...query,
      email: payload.email ? payload.email : '',
      social_user_token: payload.accessToken,
      social_type: payload.socialType,
      social_user_id: payload.userId,
      source: isMobile ? 'mobile_web' : 'web'
    }
    if (payload.pictureUrl) {
      data.avatar = payload.pictureUrl
    }
    // submit
    handleAuthenticationSocialLogin(data).then((res) => {
      // handle has logged redirect url
      const { data } = res
      if (data?.token) {
        removeItem('quickUpladResume')
        defaultLoginCallBack(data)
      }
    })
  }

  const handleAuthClick = () => {
    let accessToken
    if (typeof window?.FB == 'undefined') {
      console.error(new Error('Error loading FB script'))
      return
    }
    window.FB.login(
      function (response) {
        if (response.authResponse) {
          accessToken = response.authResponse.accessToken

          window.FB.api('/me?fields=id,first_name,last_name,email', function (response) {
            const payload = {
              userId: response.id,
              firstName: response.first_name,
              lastName: response.last_name,
              email: response.email,
              pictureUrl: response.profile_pic,
              accessToken: accessToken,
              socialType: 'fb',
              redirect: redirect,
              activeKey: activeKey ? activeKey : null,
              isLogin: isLogin ? true : false
            }

            callBackMethod(payload)
            // eslint-disable-next-line no-console
          })
        } else {
          // User cancelled login or did not fully authorize
        }
      },
      {
        scope: 'email'
      }
    )
  }

  return (
    <div className={styles.login_item} onClick={handleAuthClick}>
      {/* <Image src={FacebookIcon} width={24} height={24} alt='facebook' /> */}
      <i className='icon-facebook' style={{ color: '#0062E0' }}></i>
      {showTitle && <span>{newGetStarted.links.facebook}</span>}
    </div>
  )
}

export default FacebookLogin
