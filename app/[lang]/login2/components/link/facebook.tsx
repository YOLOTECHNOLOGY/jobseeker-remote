import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { jobbseekersSocialLoginRequest } from 'store/actions/auth/jobseekersSocialLogin'
import { FacebookIcon } from 'images'

import styles from '../../index.module.scss'
import useGetStartedClient from '../../hooks'
import { removeItem } from 'helpers/localStorage'
import { useSearchParams } from 'next/navigation'

interface IFacebook {
  className?: string
  activeKey?: number
  isLogin?: boolean
  callBackMethod?: Function
  redirect?: string | string[]
  loading?: boolean
}

const FacebookLogin = (props: IFacebook) => {
  const {activeKey,isLogin,redirect} = props
  const dispatch = useDispatch()
  const [defaultLoginCallBack] = useGetStartedClient()
  const searchParams = useSearchParams()

  const query = {};
  for(const entry of searchParams.entries()) {
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
    dispatch(jobbseekersSocialLoginRequest(data))
  }


  const handleAuthClick = () => {
    let accessToken
    if (!window?.FB) {
      console.error(new Error('Error loading FB script'));
      return;
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
    <div className={styles.login_item}>
        <img src={FacebookIcon}></img>
        <span onClick={handleAuthClick}>Continue with Facebook</span>
    </div>
  )
}

export default FacebookLogin