import React, { useState, useRef, memo, useEffect } from 'react'
import styles from '../index.module.scss'
import AppleLogin from './link/apple'
import FacebookLogin from './link/facebook'
import GoogleLogin from './link/google'
import PhoneLink from './link/phone'
import Divider from '@mui/material/Divider'
import classNames from 'classnames'
import { useRouter } from 'next/navigation'
import EmailComponent from './emailComponent'
import { authenticationSendEmaillOtp } from 'store/services/auth/generateEmailOtp'
import { useDispatch } from 'react-redux'
import { displayNotification } from 'store/actions/notificationBar/notificationBar'
import { usePathname } from 'next/navigation'
import { formatTemplateString } from 'helpers/formatter'
import { CircularProgress } from 'app/components/MUIs'

import { cfKey } from 'helpers/cookies'
import Turnstile, { useTurnstile } from "react-turnstile";
import { useSearchParams } from 'next/navigation'

interface IProps {
  lang: any
  isModal?: boolean
  handleEmailClick?: () => void
  setLoginData?: any
}

const loginForEmail = (props: IProps) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const turnstile = useTurnstile()

  const {
    lang: { newGetStarted, errorcode },
    isModal = false,
    handleEmailClick,
    setLoginData
  } = props
  const [email, setEmail] = useState<string>('')
  const [isDisable, setDisable] = useState<boolean>(true)
  const [cfToken, setCfToken] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const pathname = usePathname()
  const emailRef = useRef(null)
  const cfTokenRef = useRef(null)
  const isDisableRef = useRef(null)
  const searchParams = useSearchParams()
  const referralCode = searchParams.get('referral_code')
  const invitedSource = searchParams.get('invited_source')

  useEffect(() => {
    isDisableRef.current = isDisable
  }, [isDisable])
  useEffect(() => {
    if (email) {
      emailRef.current = email
    }
  }, [email])
  useEffect(() => {
    if (cfToken) {
      cfTokenRef.current = cfToken
    }
  }, [cfToken])

  useEffect(() => {
    window.addEventListener('keydown', handleOnKeyDownEnter)
    return () => window.removeEventListener('keydown', handleOnKeyDownEnter)
  }, [])

  const handleOnKeyDownEnter = (e) => {
    if (e.key === 'Enter' && e.keyCode === 13 && !isDisableRef.current) {
      sendOtp()
    }
  }

  const sendOtp = () => {
    if (!cfTokenRef.current) {
      return
      // dispatch(
      //   displayNotification({
      //     open: true,
      //     message: 'Please try again later.',
      //     severity: 'error'
      //   })
      // )
      // return
    }
    setLoading(true)
    authenticationSendEmaillOtp({ email: emailRef.current, cf_token: cfTokenRef.current })
      .then((res) => {
        const { user_id, avatar } = res?.data?.data ?? {}
        if (isModal) {
          setLoginData({ ...res?.data?.data, email: emailRef.current })
        } else {
          if (user_id) {
            if (referralCode && invitedSource) {
              router.push(
                `${pathname}?step=2&email=${emailRef.current}&userId=${user_id}&avatar=${avatar}&referral_code=${referralCode}&invited_source=${invitedSource}`
              )
            }
            else {
              router.push(
                `${pathname}?step=2&email=${emailRef.current}&userId=${user_id}&avatar=${avatar}`
              )
            }

          } else {
            if (referralCode && invitedSource) {
              router.push(`${pathname}?step=2&email=${emailRef.current}&referral_code=${referralCode}&invited_source=${invitedSource}`)
            }
            else {
              router.push(`${pathname}?step=2&email=${emailRef.current}`)
            }

          }
        }
      })
      .catch((error) => {
        const code = error?.response?.data.code
        let transErr = errorcode[code]
        if (code === 40006) {
          transErr = formatTemplateString(transErr, {
            retry_after: error?.response?.data?.errors?.retry_after
          })
        }
        dispatch(
          displayNotification({
            open: true,
            message: transErr ?? newGetStarted.optError,
            severity: 'error'
          })
        )
      })
      .finally(() => setLoading(false))
  }

  const agreementWord = formatTemplateString(newGetStarted.agreement, {
    value1: `<a
        target='_blank'
        href='https://blog.bossjob.ph/terms-and-conditions/' rel="noreferrer"
      >
          ${newGetStarted.termsOfUse}
      </a>`,
    value2: `<a
        target='_blank'
        href='https://blog.bossjob.ph/terms-and-conditions/' rel="noreferrer"
      >
        ${newGetStarted.privacyPolicy}
      </a>`
  })

  return (
    <>
      <h2>
        {newGetStarted.title} <span>Bossjob</span>
      </h2>
      <div className={styles.phoneNumber}>
        {/* <form  autoComplete='on' onSubmit={e => e.preventDefault()}>
        <div style={{ opacity: 0, height: '1px', overflow: 'hidden', pointerEvents: 'none' }}>
          <input
            type="email"
            value={email}
            name="email-hidden"
            hidden
            autoComplete="on"
          />
          <input
            type="password"
            value={(email || '').trim() ? ' ' : ''}
            name="hidden-password"
            autoComplete="on"
          />
        </div> */}
        <div className={styles.item}>
          <EmailComponent
            lang={props.lang}
            setEmail={setEmail}
            setDisable={setDisable}
            email={email}
          />
        </div>
        {
          Boolean(cfToken) && <button className={styles.btn} disabled={isDisable} onClick={sendOtp}>
            {loading ? <CircularProgress color={'primary'} size={16} style={{ transform: "scale(1)" }} /> : newGetStarted.sendCode}
          </button>
        }
        {!cfToken && <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', height: 60 }}>
          <CircularProgress color={'primary'} size={30}
            style={{ position: 'absolute' }}
          />
          <Turnstile
            sitekey={process.env.ENV === 'production' ? '0x4AAAAAAAJCMK-FSFuXe0TG' : '0x4AAAAAAAJDRnSb5DfsUd2S'}
            theme='light'
            appearance='always'
            // appearance='interaction-only' // invisible managed challenge
            onVerify={(token) => {
              setTimeout(() => {
                setCfToken(token)
                sessionStorage.setItem(cfKey, token)
              }, 1000)
            }}
            onError={(error) => {
              console.log('error token', error)
              // setCfToken('')
              turnstile?.reset()
            }}
            style={{ position: 'relative', zIndex: 2 }}
          />
        </div>
        }
        {/* </form> */}

        <p className={styles.msg} dangerouslySetInnerHTML={{ __html: agreementWord }}></p>
      </div>
      <div className={`${styles.list} ${styles.list2}`}>
        <GoogleLogin lang={props.lang} showTitle={false} />
        <FacebookLogin lang={props.lang} showTitle={false} />
        <AppleLogin lang={props.lang} showTitle={false} />
      </div>
      <div>
        <div className={classNames([styles.divider, styles.divider_none])}>
          <Divider>{newGetStarted.continueWith}</Divider>
        </div>
      </div>
      <div className={styles.list}>
        <PhoneLink lang={props.lang} isModal={isModal} handleClick={handleEmailClick} />
      </div>
    </>
  )
}
export default memo(loginForEmail)
