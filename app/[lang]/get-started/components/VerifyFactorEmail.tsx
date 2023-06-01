import React, { useState, useEffect } from 'react'
import Captcha from './captcha/index'
import styles from '../index.module.scss'
import useGetStarted from '../hooks/useGetStarted'
import { useSelector } from 'react-redux'
import { removeItem } from 'helpers/localStorage'
import { useSearchParams } from 'next/navigation'
const VerifyFactorEmail: React.FC = function () {

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
          <h2>Verify it’s you</h2>
          <div className={styles.enterTips}>
            <p className={styles.extra}>This extra step show that it is really you trying to log in. </p>
            <p>Please enter the 6-digit code that we sent to  <span>{email}.</span></p>
          </div>
          <Captcha  autoFocus={true} onChange={onChange} error={error}/>
          <p>Check your spam mail if you didn’t receive code.</p>
        </div>
      </div>
    </>
  )
}

export default VerifyFactorEmail
