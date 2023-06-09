'use client'
import React, { useState, useEffect, useRef } from 'react'
import styles from '../index.module.scss'

import { getLang } from 'helpers/country'
import Captcha from './captcha/index'
import { authenticationSendEmaillOtp } from 'store/services/auth/generateEmailOtp'
import { useDispatch } from 'react-redux'
import { displayNotification } from 'store/actions/notificationBar/notificationBar'
import Link from 'next/link'
import { useFirstRender } from 'helpers/useFirstRender'
import { useSearchParams } from 'next/navigation'
import { useSelector } from 'react-redux'
import useGetStarted from '../hooks/useGetStarted'
import { jobbseekersLoginFailed } from 'store/actions/auth/jobseekersLogin'
import { getEmailByPhoneNumber, checkBindNumber } from 'store/services/auth/newLogin'
import { DefaultAvatar } from 'images'
function EmailFactor(props: any) {
  const firstRender = useFirstRender()
  // const [email, setEmail] = useState<string>('')
  const [emailList, setEmailList] = useState<any>([])
  const { setEmail, defaultLoginCallBack, handleAuthenticationJobseekersLogin } = useGetStarted()
  const [step, setStep] = useState<number>(1)
  const [errorText, setErrorText] = useState<string>('')
  const [number, setNumber] = useState<number>(0)
  const searchParams = useSearchParams()
  const phoneNum = '+' + searchParams.get('phone')?.trim?.()
  const dispatch = useDispatch()
  const langKey = getLang()
  const { newGetStarted } = props.lang
  const userInfo = useSelector((store: any) => store.auth.jobseekersLogin.response)
  const emailRef = useRef(null)
  useEffect(() => {
    if (phoneNum) {
      getEmailByPhoneNumber({
        phone_number: phoneNum
      }).then((res) => {
        const { data = [] } = res?.data
        setEmailList(data)
      })
    }
  }, [phoneNum])

  useEffect(() => {
    if (emailRef.current) {
      setEmail(emailRef.current)
    }
  }, [emailRef.current])

  useEffect(() => {
    if (firstRender || !Object.keys(userInfo).length) {
      return
    }
    const { data } = userInfo
    checkBindNumber({
      email: emailRef.current,
      phone_number: phoneNum
    }).then((res) => {
      console.log(res.data)
      defaultLoginCallBack(data)
    })
  }, [userInfo])

  const onChange = (code) => {
    setErrorText('')
    if (code?.length === 6) {
      handleAuthenticationJobseekersLogin(code)
    }
  }

  const sendOTPFun = (email) => {
    emailRef.current = email
    authenticationSendEmaillOtp({ email })
      .then(() => {
        setStep(2)
      })
      .catch((error) => {
        dispatch(
          displayNotification({
            open: true,
            message: error.message ?? newGetStarted.optError,
            severity: 'error'
          })
        )
      })
  }

  const sendOpt = () => {
    dispatch(jobbseekersLoginFailed({}))
    authenticationSendEmaillOtp({ email: emailRef.current })
      .then(() => {
        setNumber(new Date().getTime())
        dispatch(
          displayNotification({
            open: true,
            message: newGetStarted.resendEmailCode,
            severity: 'success'
          })
        )
      })
      .catch((error) => {
        dispatch(
          displayNotification({
            open: true,
            message: error.message ?? newGetStarted.optError,
            severity: 'error'
          })
        )
      })
  }

  return (
    <div className={styles.emailFactor}>
      {step === 1 ? (
        <>
          <h2>
            {newGetStarted.thisPhoneNumberAssociated}
          </h2>
          <p className={styles.emailTips}> 
          {newGetStarted.thisPhoneNumber} <span>{emailList?.length}</span>  {newGetStarted.accounts} {newGetStarted.youNeedToChooseVerified}</p>
          <div className={styles.phoneNumber}>
            <ul className={styles.account}>
              {emailList.map((e) => (
                <li key={e.id} onClick={() => sendOTPFun(e.email)}>
                  <img src={e.avatar || DefaultAvatar} />
                  <p className={styles.name}>
                    {e.first_name} {e.last_name}
                  </p>
                  <p className={styles.email}>{e.email}</p>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <div className={styles.phoneNumber}>
          <div className={styles.optBox}>
            <h2>{newGetStarted.verifyEmail}</h2>
            <p className={styles.enterTips}>
              {newGetStarted.sendCodeDigit}{' '}
              <span className={styles.phone_text}>{emailRef.current}</span>
            </p>

            <Captcha
              lang={props.lang}
              autoFocus={true}
              onChange={onChange}
              error={errorText}
              sendOpt={sendOpt}
              number={number}
            />
            <div>
              <div>{newGetStarted.checkSpamEmail}</div>
              <div>
                {newGetStarted.havingTrouble}{' '}
                <Link className={styles.link} href={`/${langKey}/get-started`}>
                  {newGetStarted.otherOptions}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EmailFactor
