import React, { useEffect, useState } from 'react'
import styles from '../../index.module.scss'
import { jobbseekersSocialLoginRequest } from 'store/actions/auth/jobseekersSocialLogin'
import { AppleIcon } from 'images'
import { removeItem } from 'helpers/localStorage'
import useGetStartedClient from '../../hooks/useGetStarted'
import { useSearchParams } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import * as jose from 'jose'

interface IApple {
  isLogin?: boolean
}

const APPLE_LOGIN_URL =
  'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js'

const AppleLogin = (props: IApple) => {
  const dispatch = useDispatch()
  const { defaultLoginCallBack } = useGetStartedClient()
  const searchParams = useSearchParams()

  const query = {}
  for (const entry of searchParams.entries()) {
    query[entry[0]] = entry[1]
  }

  const jobseekersSocialResponse = useSelector(
    (store: any) => store.auth.jobseekersSocialLogin?.response
  )

  useEffect(() => {
    const { data } = jobseekersSocialResponse
    if (data?.token) {
      removeItem('quickUpladResume')
      defaultLoginCallBack(data)
    }
  }, [jobseekersSocialResponse])

  const appleConfig = {
    clientId: 'com.bossjob.web',
    scope: 'name email',
    redirectURI: 'https://dev.bossjob.ph/login2',
    usePopup: true
  }

  const rs = jose.decodeJwt('eyJraWQiOiJXNldjT0tCIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL2FwcGxlaWQuYXBwbGUuY29tIiwiYXVkIjoiY29tLmJvc3Nqb2Iud2ViIiwiZXhwIjoxNjg1NjA4NDEzLCJpYXQiOjE2ODU1MjIwMTMsInN1YiI6IjAwMTE2Mi5jODllNmY5YzQ3MjA0M2MxYjg1OWVmNWFiNDRhNjI4OC4wNzM4IiwiY19oYXNoIjoiTkNxN0ZkaFpLSUlWV010T3BzN1c3USIsImVtYWlsIjoiNjR0N2Q2eG00bUBwcml2YXRlcmVsYXkuYXBwbGVpZC5jb20iLCJlbWFpbF92ZXJpZmllZCI6InRydWUiLCJpc19wcml2YXRlX2VtYWlsIjoidHJ1ZSIsImF1dGhfdGltZSI6MTY4NTUyMjAxMywibm9uY2Vfc3VwcG9ydGVkIjp0cnVlfQ.uorwivnykV5rVBNZvgb4hEEXjc3v3u-Xzdk6OKO3rYi3D3Oa-hafJqwEzAxtHVeGJSK3d8oulpBUPN_StKFJh-fwcJ80Govp57DYJ0rUR7TkdAkUawAFUqZA0IgbMGB6HNpKgoM4-T0nE4y0qatANtGUE7YXN9x9O-WhBSpsVDxZzBpc0LjqKXrjugkwzl5X9nM2pTPQFt6bmo0fuslFV43bKSTPnG0Rr2pLeHQBq06TZ0WUgPd4N_5HCl58grLqMxXw4octZmK6OeacCG4B5jo93qLYQlMzpT6OspBZ9BTgEWKjbIvpar5fOUZ-vhU_594E-Zk1vyRFiFAQnMYuCA')
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
      dispatch(jobbseekersSocialLoginRequest(data))
    } catch (error) {
      console.log('error', error)
    }
  }

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
