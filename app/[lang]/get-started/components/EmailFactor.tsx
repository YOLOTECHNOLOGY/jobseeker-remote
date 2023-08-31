'use client'
import React, { useState, useEffect, useRef } from 'react'
import styles from '../index.module.scss'
import { useRouter } from 'next/navigation'
import { getLang } from 'helpers/country'
import EmailComponent from './emailComponent'
import { authenticationSendEmaillOtp } from 'store/services/auth/generateEmailOtp'
import { useDispatch } from 'react-redux'
import { displayNotification } from 'store/actions/notificationBar/notificationBar'
import { checkIsEmailUse } from 'store/services/auth/newLogin'
import SetUpLater from './setUpLater'
import { useSearchParams } from 'next/navigation'
import { CircularProgress } from 'app/components/MUIs'
import { cfKey } from 'helpers/cookies'

function EmailFactor(props: any) {
  const [isDisable, setDisable] = useState<boolean>(true)
  const [email, setEmail] = useState<string>('')
  const [validateErr, setValidateErr] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const searchParams = useSearchParams()
  const phoneNum = '+' + searchParams.get('phone')?.trim?.()
  const dispatch = useDispatch()
  const router = useRouter()
  const langKey = getLang()
  const { newGetStarted } = props.lang
  const emailRef = useRef(null)
  const isDisableRef = useRef(null)

  useEffect(() => {
    isDisableRef.current = isDisable
  }, [isDisable])

  useEffect(() => {
    window.addEventListener('keydown', handleOnKeyDownEnter)
    return () => window.removeEventListener('keydown', handleOnKeyDownEnter)
  }, [])

  const handleOnKeyDownEnter = (e) => {
    if (e.key === 'Enter' && e.keyCode === 13 && !isDisableRef.current) {
      checkIsEmailUseFun()
    }
  }

  useEffect(() => {
    if (validateErr) {
      setValidateErr('')
    }
    if (email) {
      emailRef.current = email
    }
  }, [email])

  const checkIsEmailUseFun = () => {
    setLoading(true)
    checkIsEmailUse({ email: emailRef.current }).then((res) => {
      if (res?.data?.data) {
        setLoading(false)
        setValidateErr(newGetStarted.validateErr)
      } else {
        sendOTPFun()
      }
    })
  }

  const sendOTPFun = () => {
    const cfToken = sessionStorage.getItem(cfKey)
    authenticationSendEmaillOtp({ email: emailRef.current, cf_token: cfToken })
      .then((res) => {
        router.push(
          `/${langKey}/get-started/phone?step=4&phone=${phoneNum}&email=${emailRef.current}`
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
      .finally(() => setLoading(false))
  }

  return (
    <div className={styles.emailFactor}>
      <h2>
        {newGetStarted.twoFactor} <br />
        {/* {newGetStarted.authentication} 🔒 */}
      </h2>
      {/* <p className={styles.secure}>{newGetStarted.secure}</p> */}
      <p className={styles.emailTips}>{newGetStarted.emailTips}</p>
      <div className={styles.phoneNumber}>
        <div className={styles.item}>
          <EmailComponent
            setEmail={setEmail}
            setDisable={setDisable}
            email={email}
            lang={props.lang}
            validateErr={validateErr}
          />
        </div>
        <button className={styles.btn} disabled={isDisable} onClick={() => checkIsEmailUseFun()}>
          {loading ? <CircularProgress color={'primary'} size={16} /> : newGetStarted.sendCode}
        </button>
        <SetUpLater lang={props.lang} />
      </div>
    </div>
  )
}

export default EmailFactor
