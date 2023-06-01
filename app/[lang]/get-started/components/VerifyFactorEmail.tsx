import React, { useState, useEffect } from 'react'
import Captcha from './captcha/index'
import styles from '../index.module.scss'
import useGetStarted from '../hooks/useGetStarted'
import { useSelector } from 'react-redux'
import { removeItem } from 'helpers/localStorage'
import { useSearchParams } from 'next/navigation'
interface IProps {
  lang: any;
}

const VerifyFactorEmail = (props: IProps) => {
  const { newGetStarted } = props.lang
  const [error,setError] = useState<string>('')
  const searchParams = useSearchParams()
  const userId = searchParams.get('userId')
  const email = searchParams.get('email')
  const userInfo = useSelector((store: any) => store.auth.jobseekersLogin.response)
  const {
    setUserId, 
    setEmail, 
    handleAuthenticationJobseekersLogin,
    defaultLoginCallBack
  } =  useGetStarted()
  useEffect(() => {
    if (email) {
      setEmail(email)
    }
  }, [email])

  useEffect(() => {
    setUserId(userId)
  }, [userId])
  useEffect(() => {
    if (!Object.keys(userInfo).length) {
      return
    }
    const { data } = userInfo
    removeItem('quickUpladResume')
    defaultLoginCallBack(data)
  }, [userInfo])

  const onChange = (code) => {
    if (code?.length === 6) {
      handleAuthenticationJobseekersLogin(code)
    }
  }

  return (
    <>
      <div className={styles.phoneNumber}>
        <div className={styles.optBox}>
          <h2>{newGetStarted.verifyText}</h2>
          <div className={styles.enterTips}>
            <p className={styles.extra}>{}</p>
            <p>{newGetStarted.sendCodeDigit} <span>{email}.</span></p>
          </div>
          <Captcha lang={props.lang} autoFocus={true} onChange={onChange} error={error}/>
          <p>{newGetStarted.verifyExtra}</p>
        </div>
      </div>
    </>
  )
}

export default VerifyFactorEmail
