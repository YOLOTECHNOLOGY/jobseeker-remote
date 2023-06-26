import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import classNames from 'classnames'
import Image from 'next/image'

import useGetStarted from '../../hooks/useGetStarted'
import { removeItem } from 'helpers/localStorage'

import { GoogleLogo } from 'images'
import styles from '../../index.module.scss'

interface IGoogle {
  className?: string
  activeKey?: number
  isLogin?: boolean
  redirect?: string | string[]
  lang: any
}

const GoogleLogin = (props: IGoogle) => {
  const {
    activeKey,
    isLogin,
    redirect,
    lang: { newGetStarted }
  } = props
  const { defaultLoginCallBack, handleAuthenticationSocialLogin } = useGetStarted()
  const [googleAuth, setGoogleAuth] = useState(null)
  const [init, setInit] = useState(false)
  const searchParams = useSearchParams()
  const query = {}
  for (const entry of searchParams.entries()) {
    query[entry[0]] = entry[1]
  }

  useEffect(() => {
    setInit(typeof window?.gapi != 'undefined')
  }, [window?.gapi])

  // load google script libs
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const script = document.createElement('script')
      const handleClientLoad = () => window.gapi.load('client:auth2', initClient)
      const initClient = () => {
        window.gapi.client
          .init({
            apiKey: 'AIzaSyAFYSp8vzxmXF_PourfSFW6t0VynH5d9Vs',
            clientId: '197019623682-n8mch4vlad6r9c6t3vhovu01sartbahq.apps.googleusercontent.com',
            scope: 'https://www.googleapis.com/auth/userinfo.profile'
          })
          .then(() => {
            setGoogleAuth(window.gapi.auth2.getAuthInstance())
          })
        setInit(true)
        document?.body?.removeChild?.(script)
      }

      script.src = 'https://apis.google.com/js/api.js'
      script.async = true
      script.defer = true
      script.type = 'text/javascript'
      script.onload = handleClientLoad
      script.onerror = () => {
        setInit(false)
      }
      document.body.appendChild(script)
    }
    return () => {
      setGoogleAuth(null)
    }
  }, [])

  // handle login for service
  const callBackMethod = (payload) => {
    const data = {
      ...payload,
      ...query,
      email: payload.email ? payload.email : '',
      social_user_token: payload.accessToken,
      social_type: payload.socialType,
      social_user_id: payload.userId,
      source: 'web'
    }
    if (payload.pictureUrl) {
      data.avatar = payload.pictureUrl
    }
    // submit
    handleAuthenticationSocialLogin(data).then(res => {
      // handle has logged redirect url
      const { data } = res
      if (data?.token) {
        removeItem('quickUpladResume')
        defaultLoginCallBack(data)
      }
    })
  }

  // login google cb
  const handleAuthClick = () => {
    if (!googleAuth) {
      console.error(new Error('Error loading google auth script'))
      return
    }
    googleAuth?.signIn().then(() => {
      handleSigninStatus()
    })
  }

  // handle login google service
  const handleSigninStatus = async () => {
    const user = googleAuth.currentUser.get()
    const isAuthorized = user.hasGrantedScopes('profile')

    if (isAuthorized) {
      const accessToken = user.getAuthResponse().id_token

      if (typeof window !== 'undefined') {
        const request = window.gapi.client.request({
          method: 'GET',
          path: 'https://www.googleapis.com/oauth2/v2/userinfo?fields=id,email,family_name,given_name,picture'
        })

        // Execute the API request.
        request.execute(function (response) {
          const payload = {
            userId: response.id,
            firstName: response.given_name,
            lastName: response.family_name,
            email: response.email,
            pictureUrl: response.picture,
            accessToken: accessToken,
            socialType: 'google',
            redirect: redirect,
            activeKey: activeKey,
            isLogin: isLogin ? true : false
          }
          callBackMethod(payload)
        })
      }
    }
  }

  return (
    <div
      className={classNames([styles.login_item, !init ? styles.login_disabled : ''])}
      onClick={handleAuthClick}
    >
      <Image width={24} height={24} alt='Sign in with google' src={GoogleLogo} />
      <span>{newGetStarted.links.google}</span>
    </div>
  )
}

export default GoogleLogin
