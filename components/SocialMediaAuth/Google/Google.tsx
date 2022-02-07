import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
// import { gapi, loadAuth2 } from 'gapi-script'
// const { gapi } = require('gapi-script')

/* Styles */
import styles from '../SocialMediaAuth.module.scss'

/* Images */
import { GoogleLogo } from 'images'

interface IGoogle {
  className?: string,
  activeKey?: number,
  isLogin?: boolean,
  callBackMethod?: Function,
  redirect?: string | string[],
  loading?: boolean
}

declare const window: any;

const Google = ({
  className,
  activeKey,
  isLogin,
  callBackMethod,
  redirect,
  loading
}: IGoogle) => {
  const [googleAuth, setGoogleAuth] = useState(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setGoogleAuth(null)
      const handleClientLoad = () => window.gapi.load('client:auth2', initClient)
      const initClient = () => {
        window.gapi.client
          .init({
            apiKey: 'AIzaSyAFYSp8vzxmXF_PourfSFW6t0VynH5d9Vs',
            clientId: '197019623682-n8mch4vlad6r9c6t3vhovu01sartbahq.apps.googleusercontent.com',
            scope: 'https://www.googleapis.com/auth/userinfo.profile',
          })
          .then(() => {
            console.log('oauth loaded')
            setGoogleAuth(window.gapi.auth2.getAuthInstance())
          })
      }

       const script = document.createElement('script')

       script.src = 'https://apis.google.com/js/api.js'
       script.async = true
       script.defer = true
       script.onload = handleClientLoad

       document.body.appendChild(script)

       return () => {
         document.body.removeChild(script)
       }
    }
  }, [])

  const handleAuthClick = () => {
    googleAuth?.signIn().then(() => {
      handleSigninStatus()
    })
  }

  const handleSigninStatus = () => {
    const user = googleAuth.currentUser.get()
    const isAuthorized = user.hasGrantedScopes('profile')

    if (isAuthorized) {
      const accessToken = user.getAuthResponse().id_token

      if (typeof window !== 'undefined') {
        const request = window.gapi.client.request({
          method: 'GET',
          path:
            'https://www.googleapis.com/oauth2/v2/userinfo?fields=id,email,family_name,given_name,picture'
        })

        // Execute the API request.
        request.execute(function(response) {
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

          console.log('before callback')
          callBackMethod(payload)
          console.log('after callback')
        })
      }
    }
  }

  return (
    <div
      className={
        loading || !googleAuth
          ? classNames(className, styles.ButtonWrapper, styles.GoogleButton, styles.disabled)
          : classNames(className, styles.ButtonWrapper, styles.GoogleButton)
      }
      onClick={handleAuthClick}
    >
      <img
        src={GoogleLogo}
        width={20}
        height={20}
        title="Login via Google"
        alt="Login via Google"
      />
    </div>
  )
}

export default Google