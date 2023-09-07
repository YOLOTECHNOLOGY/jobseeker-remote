import React, { useEffect, useState } from 'react'
import Captcha from './captcha/index'
import styles from '../index.module.scss'
import { useSearchParams } from 'next/navigation'
import { useFirstRender } from 'helpers/useFirstRender'
import { removeItem } from 'helpers/localStorage'
import useGetStarted from '../hooks/useGetStarted'
import { getLang } from 'helpers/country'
import { authenticationSendEmaillOtp } from 'store/services/auth/generateEmailOtp'
import { useDispatch } from 'react-redux'
import { displayNotification } from 'store/actions/notificationBar/notificationBar'
import { jobbseekersLoginFailed } from 'store/actions/auth/jobseekersLogin'
import { useRouter } from 'next/navigation'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import { cfKey } from 'helpers/cookies'
import UserAvatar from './userAvatar'

const verifyEmail = function (props) {
  const { isModal, lang, loginData, setStep, handleBackClick } = props
  const { newGetStarted } = lang
  const searchParams = useSearchParams()
  const referralCode = searchParams.get('referral_code')
  const invitedSource = searchParams.get('invited_source')

  // const userId = searchParams.get('userId')
  // const email = searchParams.get('email')
  // const avatar = searchParams.get('avatar')
  let userId = null
  let email = null
  let avatar = null
  if (isModal) {
    userId = loginData?.user_id
    email = loginData?.email
    avatar = loginData?.avatar
  } else {
    userId = searchParams.get('userId')
    email = searchParams.get('email')
    avatar = searchParams.get('avatar')
  }

  const langKey = getLang()
  const [errorText, setErrorText] = useState<string>('')
  const [number, setNumber] = useState<number>(0)
  const {
    setUserId,
    setEmail,
    defaultLoginCallBack,
    handleAuthenticationJobseekersLogin,
    handleAuthenticationSendEmailMagicLink,
    userInfo,
    error
  } = useGetStarted()

  const dispatch = useDispatch()
  const router = useRouter()
  useEffect(() => {
    dispatch(jobbseekersLoginFailed({}))
    setErrorText('')
  }, [])


  useEffect(() => {
    const text = error?.data?.message ?? ''
    setErrorText(text)
  }, [JSON.stringify(error)])
  const firstRender = useFirstRender()
  useEffect(() => {
    if (email) {
      setEmail(email)
    }
  }, [email])


  useEffect(() => {
    setUserId(userId)
  }, [userId])

  useEffect(() => {
    if (firstRender || (userInfo && !Object.keys(userInfo).length)) {
      return
    }
    const { data } = userInfo || {}
    removeItem('quickUpladResume')
    defaultLoginCallBack(data)
  }, [userInfo])

  const onChange = (code) => {
    setErrorText('')
    if (code?.length === 6) {
      handleAuthenticationJobseekersLogin(code, referralCode || undefined, invitedSource || undefined)
    }
  }

  const sendOpt = () => {
    const cfToken = sessionStorage.getItem(cfKey)
    dispatch(jobbseekersLoginFailed({}))
    authenticationSendEmaillOtp({ email, cf_token: cfToken })
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
    <>
      <div className={styles.phoneNumber}>
        <div className={styles.optBox}>
          {userId ? (
            <>
              <h2>{newGetStarted.welcomeBack} 🎉</h2>
              <UserAvatar avatar={avatar} />
              <p className={styles.enterTips}>
                {newGetStarted.sendCodeDigit}
                {/* <span className={styles.phone_text}>{email}</span> */}
              </p>
            </>
          ) : (
            <>
              <h2>{newGetStarted.signUpAnAccount} 🎉</h2>
              <p className={styles.enterTips}>
                {newGetStarted.sendCodeDigit}
                {/* <span className={styles.phone_text}>{email}</span> */}
              </p>
            </>
          )}

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
              <span
                className={styles.link}
                onClick={() => (isModal ? setStep() : router.push(`/${langKey}/get-started`))}
              >
                {newGetStarted.otherOptions}
              </span>
            </div>
            <div>
              {newGetStarted.alternatively}
              <span
                className={styles.link}
                onClick={() => handleAuthenticationSendEmailMagicLink()}
              >
                {' '}
                {newGetStarted.magicLink}
              </span>
            </div>
            <div
              className={styles.backBox}
              onClick={() =>
                isModal ? handleBackClick?.() : history.back()
              }
            >
              <KeyboardArrowLeftIcon />
              <span>{newGetStarted.back}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default verifyEmail
