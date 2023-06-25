import React, { useState, useEffect } from 'react'
import Captcha from './captcha/index'
import styles from '../index.module.scss'
import useGetStarted from '../hooks/useGetStarted'
import { useSelector, useDispatch } from 'react-redux'
import { removeItem } from 'helpers/localStorage'
import { useSearchParams } from 'next/navigation'
import { authenticationSendEmaillOtp } from 'store/services/auth/generateEmailOtp'
import { displayNotification } from 'store/actions/notificationBar/notificationBar'
import { jobbseekersLoginFailed } from 'store/actions/auth/jobseekersLogin'
interface IProps {
  lang: any
}

const VerifyFactorEmail = (props: IProps) => {
  const { newGetStarted } = props.lang
  const [errorText, setErrorText] = useState<string>('')
  const searchParams = useSearchParams()
  const userId = searchParams.get('userId')
  const email = decodeURIComponent(searchParams.get('email'))
 // const userInfo = useSelector((store: any) => store.auth.jobseekersLogin.response)
  const [number, setNumber] = useState<number>(0)
  const dispatch = useDispatch()
  const { setUserId, setEmail, handleAuthenticationJobseekersLogin, defaultLoginCallBack ,userInfo, error} =
    useGetStarted()
  useEffect(() => {
    if (email) {
      setEmail(email)
    }
  }, [email])

 // const error = useSelector((store: any) => store.auth.jobseekersLogin.error)

  useEffect(() => {
    const text = error?.data?.message ?? ''
    setErrorText(text)
  }, [JSON.stringify(error)])

  useEffect(() => {
    setUserId(userId)
  }, [userId])
  console.log({userInfo})
  useEffect(() => {
    if (userInfo?.data && !Object.keys(userInfo).length) {
      return
    }
    const { data } = userInfo  || {}
    removeItem('quickUpladResume')
    defaultLoginCallBack(data)
  }, [userInfo])

  const onChange = (code) => {
    dispatch(jobbseekersLoginFailed({}))
    if (code?.length === 6) {
      handleAuthenticationJobseekersLogin(code)
    }
  }

  const sendOpt = () => {
    dispatch(jobbseekersLoginFailed({}))
    authenticationSendEmaillOtp({ email }).then(() => {
      setNumber(new Date().getTime())
      dispatch(
        displayNotification({
          open: true,
          message: newGetStarted.resendEmailCode,
          severity: 'success'
        })
      )
    })
  }

  return (
    <>
      <div className={styles.phoneNumber}>
        <div className={styles.optBox}>
          <h2>{newGetStarted.verifyText}</h2>
          <div className={styles.enterTips}>
            <p className={styles.extra}>{}</p>
            <p>
              {newGetStarted.sendCodeDigit} <span>{email}.</span>
            </p>
          </div>
          <Captcha
            lang={props.lang}
            autoFocus={true}
            sendOpt={sendOpt}
            onChange={onChange}
            error={errorText}
            number={number}
          />
          <p>{newGetStarted.verifyExtra}</p>
        </div>
      </div>
    </>
  )
}

export default VerifyFactorEmail
