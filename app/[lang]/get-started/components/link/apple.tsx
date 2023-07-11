import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import * as jose from 'jose'
import classNames from 'classnames'
import useGetStarted from '../../hooks/useGetStarted'
import { removeItem } from 'helpers/localStorage'
import { AppleIcon } from 'images'
import styles from '../../index.module.scss'

interface IApple {
  isLogin?: boolean
  lang: any
}

const APPLE_LOGIN_URL =
  'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js'

const AppleLogin = (props: IApple) => {
  const {
    lang: { newGetStarted }
  } = props
  const searchParams = useSearchParams()
  const [init, setInit] = useState(false)
  const { defaultLoginCallBack, handleAuthenticationSocialLogin } = useGetStarted()

  const query = {}
  for (const entry of searchParams.entries()) {
    query[entry[0]] = entry[1]
  }

  useEffect(() => {
    setInit(typeof window?.AppleID != 'undefined')
  }, [window?.AppleID])

  const appleConfig = {
    clientId: 'com.bossjob.web',
    scope: 'name email',
    redirectURI: `${location.origin}/get-started`,
    usePopup: true
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.AppleID) return
      const script = document.createElement('script')
      const handleClientLoad = () => {
        if (!window?.AppleID) {
          console.error(new Error('Error loading apple script'))
          return
        }
        setInit(true)
        window.AppleID.auth.init(appleConfig)
        document?.body?.removeChild(script)
      }
      script.src = APPLE_LOGIN_URL
      script.type = 'text/javascript'
      script.async = true
      script.defer = true
      script.onload = handleClientLoad
      script.onerror = () => {
        setInit(false)
      }
      if (!window?.AppleID) {
        document.body.appendChild(script)
      }
    }
  }, [])

  // handle has logged redirect url

  // handle login for apple service
  const handleAuth = async () => {
    if (!window?.AppleID) {
      console.error(new Error('Error loading apple script'))
      return
    }
    try {
      const data = await window.AppleID.auth.signIn()
      // Handle successful response.
      callBackMethod(data)
    } catch (error) {
      console.log('error', error)
    }
  }

  const callBackMethod = (payload) => {
    try {
      const decodeJwt = jose.decodeJwt(payload?.authorization?.id_token)
      const data = {
        ...payload,
        ...query,
        email: payload?.user?.email ? payload?.user?.email : '',
        social_user_token: payload?.authorization?.id_token,
        social_type: 'apple',
        social_user_id: decodeJwt.sub || '',
        source: 'web'
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
    } catch (error) {
      console.log('error', error)
    }
  }

  return (
    // <div className={styles.login_item}>
    <div
      className={classNames([styles.login_item, !init ? styles.login_disabled : ''])}
      onClick={handleAuth}
    >
      <img src={AppleIcon}></img>
      {/* <div id="appleid-signin" data-color="black" data-border="true" data-type="sign in"></div> */}
      <span data-type='sign in' aria-label='Sign in with apple ID'>
        {newGetStarted.links.apple}
      </span>
    </div>
  )
}

export default AppleLogin
