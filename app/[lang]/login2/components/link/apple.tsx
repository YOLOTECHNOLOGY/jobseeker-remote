import React, { useEffect, useState } from 'react'
import styles from '../../index.module.scss'
import { jobbseekersSocialLoginRequest } from 'store/actions/auth/jobseekersSocialLogin'
import { AppleIcon } from 'images'
import { removeItem } from 'helpers/localStorage'
import useGetStartedClient from '../../hooks/useGetStarted'
import { useSearchParams } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'

interface IApple {
  isLogin?: boolean
}

const APPLE_LOGIN_URL =
  'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js'

const AppleLogin = (props: IApple) => {
  const dispatch = useDispatch()
  // const { defaultLoginCallBack } = useGetStartedClient()
  const searchParams = useSearchParams()

  const query = {}
  for (const entry of searchParams.entries()) {
    query[entry[0]] = entry[1]
  }

  // const jobseekersSocialResponse = useSelector(
  //   (store: any) => store.auth.jobseekersSocialLogin?.response
  // )

  // useEffect(() => {
  //   const { data } = jobseekersSocialResponse
  //   if (data?.token) {
  //     removeItem('quickUpladResume')
  //     defaultLoginCallBack(data)
  //   }
  // }, [jobseekersSocialResponse])

  const appleConfig = {
    clientId: 'com.poseidon.bossjobapp.client',
    scope: 'name email',
    redirectURI: 'https://dev.bossjob.ph/',
    state: '',
    nonce: '',
    usePopup: true
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleClientLoad = () => {
        if (!window?.AppleID) {
          console.error(new Error('Error loading apple script'))
          return
        }
        window.AppleID.auth.init(appleConfig)
      }

      const script = document.createElement('script')

      script.src = APPLE_LOGIN_URL
      script.async = true
      script.defer = true
      script.crossOrigin = 'anonymous'
      script.onload = handleClientLoad

      document.body.appendChild(script)

      return () => {
        document.body.removeChild(script)
      }
    }
  }, [])

  const handleAuth = async () => {
    if (!window?.AppleID) {
      console.error(new Error('Error loading apple script'))
      return
    }
    try {
      const data = await window.AppleID.auth.signIn()
      // Handle successful response.
      console.log('success', data)
      // callBackMethod(data)
    } catch (error) {
      // Handle error.
      console.log('error', error)
    }
  }

  const callBackMethod = (payload) => {
    const data = {
      ...payload,
      ...query,
      email: payload.email ? payload.email : '',
      social_user_token: payload.accessToken,
      social_type: 'apple',
      social_user_id: payload.userId || '',
      source: 'web'
    }
    if (payload.pictureUrl) {
      data.avatar = payload.pictureUrl
    }
    dispatch(jobbseekersSocialLoginRequest(data))
  }

  useEffect(() => {
    if (typeof window != 'undefined') {
      // Listen for authorization success.
      document.addEventListener('AppleIDSignInOnSuccess', (event: any) => {
        // Handle successful response.
        console.log('success: ', event.detail.data)
      })

      // Listen for authorization failures.
      document.addEventListener('AppleIDSignInOnFailure', (event: any) => {
        // Handle error.
        console.log('error: ', event.detail.error)
      })
    }
  }, [])

  return (
    <div className={styles.login_item}>
      <img src={AppleIcon}></img>
      {/* <div id="appleid-signin" data-color="black" data-border="true" data-type="sign in"></div> */}
      <span data-type='sign in' aria-label='Sign in with apple ID' onClick={handleAuth}>
        Continue with Apple
      </span>
    </div>
  )
}

export default AppleLogin
