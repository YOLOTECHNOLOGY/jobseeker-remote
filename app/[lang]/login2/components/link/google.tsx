import React,{useState, useEffect} from 'react'
import { useDispatch } from 'react-redux'

import { jobbseekersSocialLoginRequest } from 'store/actions/auth/jobseekersSocialLogin'
import { GoogleLogo } from 'images'

import styles from '../../index.module.scss'

interface IGoogle {
  className?: string,
  activeKey?: number,
  isLogin?: boolean,
  callBackMethod?: Function,
  redirect?: string | string[],
}

const GoogleLogin = (props: IGoogle)  => {
  const {activeKey,isLogin,redirect} = props
  const [googleAuth, setGoogleAuth] = useState(null)
  const dispatch = useDispatch()


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


  const callBackMethod = (payload) => {
    const data = {
      ...payload,
      // ...router.query,
      // avatar: payload.pictureUrl ? payload.pictureUrl : '',
      email: payload.email ? payload.email : '',
      social_user_token: payload.accessToken,
      social_type: payload.socialType,
      social_user_id: payload.userId,
      source: 'web'
    }
    if (payload.pictureUrl) {
      data.avatar = payload.pictureUrl
    }
    dispatch(jobbseekersSocialLoginRequest(data))
  }


  const handleSigninStatus = async () => {
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
          callBackMethod(payload)
        })
      }
    }
  }

  return (
    <div className={styles.login_item}>
        <img src={GoogleLogo} />
        <span onClick={handleAuthClick}>Continue with Google</span>
    </div>
  )
}

export default GoogleLogin